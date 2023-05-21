import { useRouter } from 'next/router'
import { useCallback, useEffect, useReducer, useState } from 'react'
import styled from 'styled-components'

import { isAddress } from '@ethersproject/address'
import { BigNumber } from '@ethersproject/bignumber'
import { BigNumberish } from '@ethersproject/bignumber'
import { wei } from '@synthetixio/wei'

import usePrevious from '../common/usePrevious'
import ENSOrAddress from '@/src/components/aelin/ENSOrAddress'
import { TokenIcon } from '@/src/components/pools/common/TokenIcon'
import {
  AddressWhiteListProps,
  AddressesWhiteListAmountFormat,
} from '@/src/components/pools/whitelist/addresses/types'
import { NftType } from '@/src/components/pools/whitelist/nft/nftWhiteListReducer'
import { ChainsValues, getKeyChainByValue } from '@/src/constants/chains'
import { contracts } from '@/src/constants/contracts'
import { EXCHANGE_DECIMALS, ZERO_ADDRESS, ZERO_BN } from '@/src/constants/misc'
import { Privacy } from '@/src/constants/pool'
import { Token } from '@/src/constants/token'
import {
  getDealCreatedId,
  useAelinUpfrontDealFactoryTransaction,
} from '@/src/hooks/contracts/useAelinUpfrontDealFactoryTransaction'
import { GasOptions, useTransactionModal } from '@/src/providers/transactionModalProvider'
import { useWeb3Connection } from '@/src/providers/web3ConnectionProvider'
import { getDuration, isEmptyDuration, secondsToDhm } from '@/src/utils/date'
import { formatNumber } from '@/src/utils/formatNumber'
import { parseValuesToCreateUpFrontDeal } from '@/src/utils/parseValuesToCreateUpFrontDeal'
import { promisifyWorker } from '@/src/utils/promisifyWorker'
import validateCreateUpfrontDeal, { dealErrors } from '@/src/utils/validate/createUpfrontDeal'
import { storeFile } from '@/src/utils/web3storage'

const VestinScheduleContainer = styled.div`
  display: flex;
  flex-direction: column;
`

export enum CreateUpFrontDealSteps {
  dealAttributes = 'dealAttributes',
  investmentToken = 'investmentToken',
  redemptionDeadline = 'redemptionDeadline',
  sponsorFee = 'sponsorFee',
  holderAddress = 'holderAddress',
  dealToken = 'dealToken',
  dealPrivacy = 'dealPrivacy',
  exchangeRates = 'exchangeRates',
  vestingSchedule = 'vestingSchedule',
}

interface CreateUpFrontDealStepInfo {
  order: number
  title: string
  text: string[] | undefined
  placeholder: string[] | undefined
  id: CreateUpFrontDealSteps
  getSummaryValue: (...args: any) => string | JSX.Element
}

export type DealAttr = {
  name: string
  symbol: string
}

export type VestingScheduleAttr = {
  vestingCliff?: Duration
  vestingPeriod?: Duration
}

export type ExchangeRatesAttr = {
  investmentTokenToRaise?: number
  exchangeRates?: string
  isCapped: boolean
  hasDealMinimum: boolean
  minimumAmount?: number
}

export type Allowlist = {
  allowListAddresses: string[]
  allowListAmounts: BigNumberish[]
}

export interface CreateUpFrontDealState {
  dealAttributes: DealAttr
  investmentToken?: Token
  redemptionDeadline?: Duration
  sponsorFee: number
  holderAddress?: string
  dealToken?: Token
  exchangeRates?: ExchangeRatesAttr
  vestingSchedule?: VestingScheduleAttr
  dealPrivacy?: Privacy
  currentStep: CreateUpFrontDealSteps
  whitelist: AddressWhiteListProps[]
  whiteListAmountFormat?: AddressesWhiteListAmountFormat
  withMerkleTree: boolean
  nftCollectionRules: NftCollectionRulesProps[]
}

export interface CreateUpFrontDealStateComplete {
  [NftType.erc1155]: NftCollectionRulesProps[] | undefined
  [NftType.erc721]: NftCollectionRulesProps[] | undefined
  dealAttributes: DealAttr
  investmentToken: Token
  redemptionDeadline: { days?: number; hours?: number; minutes?: number }
  sponsorFee?: BigNumberish
  vestingSchedule: {
    vestingCliff: { days?: number; hours?: number; minutes?: number }
    vestingPeriod?: { days?: number; hours?: number; minutes?: number }
  }
  dealPrivacy: Privacy
  dealToken: Token
  holderAddress: string
  exchangeRates: ExchangeRatesAttr
  currentStep: CreateUpFrontDealSteps
  whitelist: AddressWhiteListProps[]
  whiteListAmountFormat?: AddressesWhiteListAmountFormat
  withMerkleTree: boolean
  nftCollectionRules: NftCollectionRulesProps[]
}

export type NftCollectionRulesProps = {
  purchaseAmount: BigNumberish
  collectionAddress: string
  purchaseAmountPerToken: boolean
  tokenIds: BigNumber[]
  minTokensEligible: BigNumber[]
}

export type UpFrontDealData = {
  name: string
  symbol: string
  purchaseToken: string
  underlyingDealToken: string
  holder: string
  sponsor: string
  sponsorFee: BigNumber
  merkleRoot: string
  ipfsHash: string
}

export type UpFrontDealConfig = {
  underlyingDealTokenTotal: BigNumber
  purchaseTokenPerDealToken: BigNumber
  purchaseRaiseMinimum: BigNumber
  purchaseDuration: number
  vestingPeriod: number
  vestingCliffPeriod: number
  allowDeallocation: boolean
}

export type CreateUpFrontDealValues = [
  UpFrontDealData,
  UpFrontDealConfig,
  NftCollectionRulesProps[],
  Allowlist,
]

export const createDealConfig: Record<CreateUpFrontDealSteps, CreateUpFrontDealStepInfo> = {
  [CreateUpFrontDealSteps.dealAttributes]: {
    id: CreateUpFrontDealSteps.dealAttributes,
    order: 1,
    title: 'Deal Naming',
    text: [
      'The name investors will see for the pool. This can be anything and will be one of the first values investors see.',
      'Symbol that pool tokens will be named, should be similar to the pool name so investors can associate the two together.',
    ],
    placeholder: ['Choose a deal name...', 'Choose a deal symbol...'],
    getSummaryValue: (currentState: CreateUpFrontDealStateComplete) => {
      const value = currentState[CreateUpFrontDealSteps.dealAttributes] as DealAttr

      if (!!value.name.length || !!value.symbol.length) {
        return (
          <>
            <span>Name: {value.name}</span>
            <span>Symbol: {value.symbol}</span>
          </>
        )
      } else {
        return '--'
      }
    },
  },
  [CreateUpFrontDealSteps.investmentToken]: {
    id: CreateUpFrontDealSteps.investmentToken,
    order: 2,
    title: 'Investment token',
    text: [
      'Copy and paste the address of the tokens investors will contribute to the pool in exchange for deal tokens. This can be any ERC-20 token. Some commonly used tokens, such as USDC, USDT, ETH, are already provided in the dropdown.',
    ],
    placeholder: ['Token name or contract address...'],
    getSummaryValue: (currentState: CreateUpFrontDealStateComplete) => {
      const value = currentState[CreateUpFrontDealSteps.investmentToken] as Token

      if (!value) return '--'

      return (
        <TokenIcon
          address={currentState[CreateUpFrontDealSteps.investmentToken].address}
          network={currentState[CreateUpFrontDealSteps.investmentToken].chainId as ChainsValues}
          symbol={currentState[CreateUpFrontDealSteps.investmentToken].symbol}
          type="row"
        />
      )
    },
  },
  [CreateUpFrontDealSteps.redemptionDeadline]: {
    id: CreateUpFrontDealSteps.redemptionDeadline,
    order: 3,
    title: 'Redemption deadline',
    text: ['Deadline investors will have to contribute investment tokens to the deal.'],
    placeholder: undefined,
    getSummaryValue: (currentState: CreateUpFrontDealStateComplete) => {
      const value = currentState[CreateUpFrontDealSteps.redemptionDeadline]

      const now = new Date()

      const duration = getDuration(now, value.days, value.hours, value.minutes)

      return secondsToDhm(duration) ?? `--`
    },
  },
  [CreateUpFrontDealSteps.sponsorFee]: {
    id: CreateUpFrontDealSteps.sponsorFee,
    order: 4,
    title: 'Sponsor fee',
    text: [
      'Fee the sponsor will receive in the deal token when investors accept the deal. If an investor declines the deal, there is no sponsor fee.',
    ],
    placeholder: ['Enter sponsor fee...'],
    getSummaryValue: (currentState: CreateUpFrontDealStateComplete) => {
      const value = currentState[CreateUpFrontDealSteps.sponsorFee]

      if (!value) return '--'

      return `${value.toString()}%`
    },
  },
  [CreateUpFrontDealSteps.holderAddress]: {
    id: CreateUpFrontDealSteps.holderAddress,
    order: 5,
    title: 'Holder Address',
    text: [
      'Copy and paste the EOA/multisig address for the token holder who is depositing deal tokens. Note - Only this address will be able to deposit deal tokens, no other addresses can be added at a later time.',
    ],
    placeholder: ['Enter holder address...'],
    getSummaryValue: (currentState: CreateUpFrontDealStateComplete) => {
      const value = currentState[CreateUpFrontDealSteps.holderAddress]

      return isAddress(value) ? <ENSOrAddress address={value as string} /> : '--'
    },
  },
  [CreateUpFrontDealSteps.dealToken]: {
    id: CreateUpFrontDealSteps.dealToken,
    order: 6,
    title: 'Deal token',
    text: [
      'Copy and paste the deal token address (ERC-20) that is being presented to the pool as your deal. Examples - SNX Address (0x8700daec35af8ff88c16bdf0418774cb3d7599b4)',
    ],
    placeholder: ['Enter deal token address...'],
    getSummaryValue: (currentState: CreateUpFrontDealStateComplete) => {
      const value = currentState[CreateUpFrontDealSteps.dealToken] as Token

      if (!value) return '--'

      return (
        <TokenIcon
          address={currentState[CreateUpFrontDealSteps.dealToken].address}
          network={currentState[CreateUpFrontDealSteps.dealToken].chainId as ChainsValues}
          symbol={currentState[CreateUpFrontDealSteps.dealToken].symbol}
          type="row"
        />
      )
    },
  },
  [CreateUpFrontDealSteps.dealPrivacy]: {
    id: CreateUpFrontDealSteps.dealPrivacy,
    order: 7,
    title: 'Deal access',
    text: [
      'If Public, anyone will be able to join the pool. If Private, only allowlisted addresses can join the pool. If NFT, only holder of collections can join the pool',
    ],
    placeholder: undefined,
    getSummaryValue: (currentState: CreateUpFrontDealStateComplete) => {
      const value = currentState[CreateUpFrontDealSteps.dealPrivacy]

      if (!value) return '--'

      return value.charAt(0).toUpperCase() + value.slice(1)
    },
  },
  [CreateUpFrontDealSteps.exchangeRates]: {
    id: CreateUpFrontDealSteps.exchangeRates,
    order: 8,
    title: 'Exchange rates',
    text: ['Decide the rate at which investment tokens will be exchanged for deal tokens'],
    placeholder: [
      'Enter the investment token amount...',
      'Enter an exchange rate...',
      'Enter a deal minimun',
    ],
    getSummaryValue: (currentState: CreateUpFrontDealStateComplete) => {
      const value = currentState[CreateUpFrontDealSteps.exchangeRates] as ExchangeRatesAttr

      const dealTokenSymbol = currentState[CreateUpFrontDealSteps.dealToken]?.symbol
      const investmentDecimals = currentState[CreateUpFrontDealSteps.investmentToken]?.decimals

      if (
        value.investmentTokenToRaise &&
        value.exchangeRates &&
        value.investmentTokenToRaise > 0 &&
        Number(value.exchangeRates) > 0
      ) {
        if (!dealTokenSymbol) return '--'

        const exchangeRatesInWei = wei(value.exchangeRates, investmentDecimals)
        if (!exchangeRatesInWei.gt(ZERO_BN)) return '--'

        const investmentPerDeal = wei(1, investmentDecimals).div(exchangeRatesInWei).toNumber()

        return (
          <>
            <span>
              {formatNumber(Number(value.exchangeRates), EXCHANGE_DECIMALS)} {dealTokenSymbol} per{' '}
              {` `}
              {currentState[CreateUpFrontDealSteps.investmentToken]?.symbol}
            </span>
            <span>
              {formatNumber(investmentPerDeal, EXCHANGE_DECIMALS)}{' '}
              {currentState[CreateUpFrontDealSteps.investmentToken]?.symbol} per {dealTokenSymbol}
            </span>
          </>
        )
      }

      return '--'
    },
  },
  [CreateUpFrontDealSteps.vestingSchedule]: {
    id: CreateUpFrontDealSteps.vestingSchedule,
    order: 9,
    title: 'Vesting schedule',
    text: undefined,
    placeholder: undefined,
    getSummaryValue: (currentState: CreateUpFrontDealStateComplete) => {
      const value = currentState[CreateUpFrontDealSteps.vestingSchedule] as VestingScheduleAttr

      const hasVestingCliff = !isEmptyDuration(value.vestingCliff as Duration, undefined)
      const hasVestingSchedule = !isEmptyDuration(value.vestingPeriod as Duration, undefined)

      if (hasVestingCliff && hasVestingSchedule) {
        const vestingCliff = value.vestingCliff as Duration
        const vestingPeriod = value.vestingPeriod as Duration

        const now = new Date()

        const vestingCliffDuration = getDuration(
          now,
          vestingCliff.days ?? 0,
          vestingCliff.hours ?? 0,
          vestingCliff.minutes ?? 0,
        )

        const vestingPeriodDuration = getDuration(
          now,
          vestingPeriod.days ?? 0,
          vestingPeriod.hours ?? 0,
          vestingPeriod.minutes ?? 0,
        )

        return (
          <VestinScheduleContainer>
            <span>
              Cliff:{` `}
              {secondsToDhm(vestingCliffDuration) ?? '--'}
            </span>
            <span>
              Period:{` `}
              {secondsToDhm(vestingPeriodDuration) ?? '--'}
            </span>
          </VestinScheduleContainer>
        )
      }
      return '--'
    },
  },
}

export const CreateUpFrontDealConfigArr = Object.values(createDealConfig)

export const getCreateDealSummaryData = (
  createDealState: CreateUpFrontDealState,
): { title: string; value: string | JSX.Element }[] =>
  CreateUpFrontDealConfigArr.map((step) => ({
    title: step.title,
    value: step.getSummaryValue(createDealState),
  }))

const initialState: CreateUpFrontDealState = {
  [CreateUpFrontDealSteps.dealAttributes]: {
    name: '',
    symbol: '',
  },
  [CreateUpFrontDealSteps.investmentToken]: undefined,
  [CreateUpFrontDealSteps.redemptionDeadline]: {
    days: undefined,
    hours: undefined,
    minutes: undefined,
  },
  [CreateUpFrontDealSteps.sponsorFee]: 0,
  [CreateUpFrontDealSteps.holderAddress]: undefined,
  [CreateUpFrontDealSteps.dealToken]: undefined,
  [CreateUpFrontDealSteps.dealPrivacy]: undefined,
  [CreateUpFrontDealSteps.exchangeRates]: {
    investmentTokenToRaise: undefined,
    exchangeRates: undefined,
    isCapped: true,
    hasDealMinimum: false,
    minimumAmount: undefined,
  },
  [CreateUpFrontDealSteps.vestingSchedule]: {
    vestingCliff: {
      days: undefined,
      hours: undefined,
      minutes: undefined,
    },
    vestingPeriod: {
      days: undefined,
      hours: undefined,
      minutes: undefined,
    },
  },
  currentStep: CreateUpFrontDealSteps.dealAttributes,
  whitelist: [],
  whiteListAmountFormat: undefined,
  withMerkleTree: false,
  nftCollectionRules: [],
}

type CreateDealAction =
  | {
      type: 'updateDeal'
      payload: {
        field: CreateUpFrontDealSteps | string
        value: unknown
      }
    }
  | {
      type: 'updateStep'
      payload: CreateUpFrontDealSteps
    }
  | { type: 'reset' }

const setValueOf = (obj: CreateUpFrontDealState, value: unknown, path: string) => {
  const fields = path.split('.')

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  fields.reduce((o: any, level: string, idx: number) => {
    if (idx === fields.length - 1) {
      o[level] = value
    }
    return o && o[level]
  }, obj)
}

const createDealReducer = (state: CreateUpFrontDealState, action: CreateDealAction) => {
  const { type } = action

  if (type === 'updateDeal') {
    const { field, value } = action.payload

    setValueOf(state, value, field as string)

    return { ...state }
  }

  if (type === 'updateStep') {
    return { ...state, currentStep: action.payload }
  }

  if (type === 'reset') {
    return initialState
  }

  throw new Error(`Unknown action type: ${type}`)
}

export const getCreateDealStepIndicatorData = (
  currentStep: CreateUpFrontDealSteps,
): { title: string; isActive: boolean }[] =>
  Object.values(CreateUpFrontDealSteps).map((step) => ({
    isActive: currentStep === step,
    title: createDealConfig[step].title,
  }))

export default function useAelinCreateDeal(chainId: ChainsValues) {
  const { address, appChainId } = useWeb3Connection()
  const prevAppChainId = usePrevious(appChainId)
  const [createDealState, dispatch] = useReducer(createDealReducer, initialState)
  const [errors, setErrors] = useState<dealErrors>()
  const [direction, setDirection] = useState<'next' | 'prev' | undefined>()
  const [showWarningOnLeave, setShowWarningOnLeave] = useState<boolean>(false)
  const router = useRouter()
  const { isSubmitting, setConfigAndOpenModal } = useTransactionModal()
  const { estimate: createUpFrontDealEstimate, execute } = useAelinUpfrontDealFactoryTransaction(
    contracts.UPFRONT_DEAL_FACTORY.address[chainId],
    'createUpFrontDeal',
  )

  useEffect(() => {
    if (appChainId && prevAppChainId && prevAppChainId !== appChainId) dispatch({ type: 'reset' })
  }, [appChainId, prevAppChainId])

  const moveStep = (value: 'next' | 'prev') => {
    const { currentStep } = createDealState
    const currentStepOrder = createDealConfig[currentStep as CreateUpFrontDealSteps].order

    setDirection(value)

    if (value === 'next') {
      const nextStep = CreateUpFrontDealConfigArr.find(
        ({ order }) => order === currentStepOrder + 1,
      )
      return nextStep ? dispatch({ type: 'updateStep', payload: nextStep.id }) : null
    }

    if (value === 'prev') {
      const prevStep = CreateUpFrontDealConfigArr.find(
        ({ order }) => order === currentStepOrder - 1,
      )
      return prevStep ? dispatch({ type: 'updateStep', payload: prevStep.id }) : null
    }

    return dispatch({ type: 'updateStep', payload: value })
  }

  const handleCreateUpFrontDeal = async () => {
    const [upFrontDealData, upFrontDealConfig, nftCollectionRules, allowListAddresses] =
      parseValuesToCreateUpFrontDeal(
        createDealState as CreateUpFrontDealStateComplete,
        address ?? ZERO_ADDRESS,
      )

    const isAMerkleTreePool =
      createDealState.withMerkleTree && createDealState.dealPrivacy === Privacy.PRIVATE

    if (isAMerkleTreePool) {
      console.info('Merkle tree pool creation')

      // Generate the merkle data thru Web Worker
      const worker = new Worker(
        new URL('@/src/utils/merkle-tree/createMerkleTree.ts', import.meta.url),
      )

      worker.postMessage({
        action: 'start',
        whitelist: createDealState.whitelist,
        investmentTokenDecimal: createDealState.investmentToken?.decimals,
        whiteListAmountFormat: createDealState.whiteListAmountFormat,
      })

      const merkleData = await promisifyWorker(worker)

      // Upload the merkle tree data json to ipfs
      const ipfsHash = await storeFile(
        merkleData.compressedTree,
        createDealState.dealAttributes.symbol,
      )

      const upFrontDealDataFull = {
        ...upFrontDealData,
        merkleRoot: merkleData.root,
        ipfsHash: ipfsHash,
      }

      /*
        Do not use allowlist values here
        because we already have the merkle tree data
        So, send it like empty arrays
      */
      const emptyAllowlistData = {
        allowListAddresses: [],
        allowListAmounts: [],
      }

      setConfigAndOpenModal({
        estimate: () =>
          createUpFrontDealEstimate([
            upFrontDealDataFull,
            upFrontDealConfig,
            nftCollectionRules,
            emptyAllowlistData,
          ]),

        title: 'Create deal',
        onConfirm: async (txGasOptions: GasOptions) => {
          setShowWarningOnLeave(false)

          try {
            const receipt = await execute(
              [upFrontDealDataFull, upFrontDealConfig, nftCollectionRules, emptyAllowlistData],
              txGasOptions,
            )

            if (receipt) {
              router.push(`/pool/${getKeyChainByValue(chainId)}/${getDealCreatedId(receipt)}`)
            }
          } catch (error) {
            console.log(error)
            setShowWarningOnLeave(true)
          }
        },
      })
    } else {
      console.info('Non merkle tree pool creation')

      setConfigAndOpenModal({
        estimate: () =>
          createUpFrontDealEstimate([
            upFrontDealData,
            upFrontDealConfig,
            nftCollectionRules,
            allowListAddresses,
          ]),
        title: 'Create deal',
        onConfirm: async (txGasOptions: GasOptions) => {
          setShowWarningOnLeave(false)

          try {
            const receipt = await execute(
              [upFrontDealData, upFrontDealConfig, nftCollectionRules, allowListAddresses],
              txGasOptions,
            )

            if (receipt) {
              router.push(`/pool/${getKeyChainByValue(chainId)}/${getDealCreatedId(receipt)}`)
            }
          } catch (error) {
            console.log(error)
            setShowWarningOnLeave(true)
          }
        },
      })
    }
  }

  const setDealField = useCallback(
    (value: unknown, field?: string) =>
      dispatch({
        type: 'updateDeal',
        payload: { field: field || createDealState.currentStep, value },
      }),
    [createDealState.currentStep],
  )

  const isFinalStep = createDealState.currentStep === CreateUpFrontDealSteps.vestingSchedule
  const isFirstStep = createDealState.currentStep === CreateUpFrontDealSteps.dealAttributes

  useEffect(() => {
    setErrors(validateCreateUpfrontDeal(createDealState, chainId))
  }, [createDealState, chainId])

  useEffect(() => {
    setShowWarningOnLeave(true)
  }, [createDealState])

  return {
    createDealState,
    direction,
    errors,
    handleCreateUpFrontDeal,
    isFinalStep,
    isFirstStep,
    isSubmitting,
    moveStep,
    setDealField,
    showWarningOnLeave,
  }
}
