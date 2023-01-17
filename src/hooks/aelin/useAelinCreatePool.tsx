import { useRouter } from 'next/router'
import { useCallback, useEffect, useReducer, useState } from 'react'

import { BigNumber } from '@ethersproject/bignumber'
import { BigNumberish } from '@ethersproject/bignumber'

import usePrevious from '../common/usePrevious'
import { TokenIcon } from '@/src/components/pools/common/TokenIcon'
import {
  AddressWhiteListProps,
  AddressesWhiteListAmountFormat,
} from '@/src/components/pools/whitelist/addresses/AddressesWhiteList'
import { NftType } from '@/src/components/pools/whitelist/nft/nftWhiteListReducer'
import { ChainsValues, getKeyChainByValue } from '@/src/constants/chains'
import { contracts } from '@/src/constants/contracts'
import { Privacy } from '@/src/constants/pool'
import { Token, isToken } from '@/src/constants/token'
import {
  getPoolCreatedId,
  useAelinPoolCreateTransaction,
} from '@/src/hooks/contracts/useAelinPoolCreateTransaction'
import { GasOptions, useTransactionModal } from '@/src/providers/transactionModalProvider'
import { useWeb3Connection } from '@/src/providers/web3ConnectionProvider'
import { getFormattedDurationFromNowToDuration, sumDurations } from '@/src/utils/date'
import { isDuration } from '@/src/utils/isDuration'
import { parseValuesToCreatePool } from '@/src/utils/parseValuesToCreatePool'
import validateCreatePool, { poolErrors } from '@/src/utils/validate/createPool'

export enum CreatePoolSteps {
  poolName = 'poolName',
  poolSymbol = 'poolSymbol',
  investmentToken = 'investmentToken',
  investmentDeadLine = 'investmentDeadLine',
  dealDeadline = 'dealDeadline',
  poolCap = 'poolCap',
  sponsorFee = 'sponsorFee',
  poolPrivacy = 'poolPrivacy',
}

interface CreatePoolStepInfo {
  order: number
  title: string
  text: string
  placeholder: string | undefined
  id: CreatePoolSteps
}

export interface CreatePoolState {
  [NftType.erc1155]: NftCollectionRulesProps[] | undefined
  [NftType.erc721]: NftCollectionRulesProps[] | undefined
  poolName: string
  poolSymbol: string
  investmentToken?: Token
  investmentDeadLine?: Duration
  dealDeadline?: Duration
  poolCap?: number
  sponsorFee?: number
  poolPrivacy?: Privacy
  currentStep: CreatePoolSteps
  whitelist: AddressWhiteListProps[]
  whiteListAmountFormat?: AddressesWhiteListAmountFormat
  nftCollectionRules: NftCollectionRulesProps[]
}

export interface CreatePoolStateComplete {
  [NftType.erc1155]: NftCollectionRulesProps[] | undefined
  [NftType.erc721]: NftCollectionRulesProps[] | undefined
  poolName: string
  poolSymbol: string
  investmentToken: Token
  investmentDeadLine: { days?: number; hours?: number; minutes?: number }
  dealDeadline: { days?: number; hours?: number; minutes?: number }
  poolCap?: number
  sponsorFee?: number
  poolPrivacy: Privacy
  currentStep: CreatePoolSteps
  whitelist: AddressWhiteListProps[]
  whiteListAmountFormat?: AddressesWhiteListAmountFormat
  nftCollectionRules: NftCollectionRulesProps[] | undefined
}

export type NftCollectionRulesProps = {
  purchaseAmount: BigNumberish
  collectionAddress: string
  purchaseAmountPerToken: boolean
  tokenIds: BigNumber[]
  minTokensEligible: BigNumber[]
}

export type CreatePoolValues = {
  name: string
  symbol: string
  purchaseTokenCap: BigNumberish
  purchaseToken: string
  duration: BigNumberish
  sponsorFee: BigNumberish
  purchaseDuration: BigNumberish
  allowListAddresses: string[]
  allowListAmounts: BigNumberish[]
  nftCollectionRules: NftCollectionRulesProps[]
}

export const createPoolConfig: Record<CreatePoolSteps, CreatePoolStepInfo> = {
  [CreatePoolSteps.poolName]: {
    id: CreatePoolSteps.poolName,
    order: 1,
    title: 'Pool name',
    text: 'Create a name for your pool',
    placeholder: 'Choose a pool name...',
  },
  [CreatePoolSteps.poolSymbol]: {
    id: CreatePoolSteps.poolSymbol,
    order: 2,
    title: 'Pool symbol',
    text: 'This symbol for the pool tokens should be similar to the pool name so investors can associate the two together.',
    placeholder: 'Enter pool symbol...',
  },
  [CreatePoolSteps.investmentToken]: {
    id: CreatePoolSteps.investmentToken,
    order: 3,
    title: 'Investment token',
    text: 'Copy and paste the address of the tokens investors will contribute to the pool in exchange for deal tokens. This can be any ERC-20 token. Some commonly used tokens, such as USDC, USDT, ETH, are already provided in the dropdown.',
    placeholder: 'Token name or contract address...',
  },
  [CreatePoolSteps.investmentDeadLine]: {
    id: CreatePoolSteps.investmentDeadLine,
    order: 4,
    title: 'Investment deadline',
    text: 'The deadline for investor to contribute invesment tokens to the pool. Note - If this is a capped pool, investors will be unable to contribute after the cap is hit.',
    placeholder: 'USDC, USDT, ETH, etc...',
  },
  [CreatePoolSteps.dealDeadline]: {
    id: CreatePoolSteps.dealDeadline,
    order: 5,
    title: 'Deal deadline',
    text: 'The deadline a sponsor has to present a deal to the pool. Investors will be able to withdraw investment tokens if a deal is not presented by this time. Note - Deals can be presented after the deal deadline, though investors may have already withdrawn their investment tokens.',
    placeholder: undefined,
  },
  [CreatePoolSteps.poolCap]: {
    id: CreatePoolSteps.poolCap,
    order: 6,
    title: 'Pool cap',
    text: 'Maximum amount of investment tokens that can be deposited to the pool. An uncappped pool allows all investors have ample time to join the pool. Excess capital will be deallocated proportionately for every investor.',
    placeholder: 'Enter pool cap...',
  },
  [CreatePoolSteps.sponsorFee]: {
    id: CreatePoolSteps.sponsorFee,
    order: 7,
    title: 'Sponsor fee',
    text: 'Fee the sponsor will receive in the deal token when investors accept the deal. If an investor declines the deal, there is no sponsor fee.',
    placeholder: 'Enter sponsor fee...',
  },
  [CreatePoolSteps.poolPrivacy]: {
    id: CreatePoolSteps.poolPrivacy,
    order: 8,
    title: 'Pool Access',
    text: 'If Public, anyone will be able to join the pool. If Private, only allowlisted addresses can join the pool. If NFT, only holder of collections can join the pool',
    placeholder: undefined,
  },
}

export const createPoolConfigArr = Object.values(createPoolConfig)

const initialState: CreatePoolState = {
  [CreatePoolSteps.poolName]: '',
  [CreatePoolSteps.poolSymbol]: '',
  [CreatePoolSteps.investmentToken]: undefined,
  [CreatePoolSteps.investmentDeadLine]: { days: undefined, hours: undefined, minutes: undefined },
  [CreatePoolSteps.dealDeadline]: { days: undefined, hours: undefined, minutes: undefined },
  [CreatePoolSteps.poolCap]: 0,
  [CreatePoolSteps.sponsorFee]: undefined,
  [CreatePoolSteps.poolPrivacy]: undefined,
  currentStep: CreatePoolSteps.poolName,
  whitelist: [],
  whiteListAmountFormat: undefined,
  nftCollectionRules: [],
  [NftType.erc1155]: undefined,
  [NftType.erc721]: undefined,
}

type CreatePoolAction =
  | {
      type: 'updatePool'
      payload: {
        field: CreatePoolValues | CreatePoolSteps | string
        value: unknown
      }
    }
  | {
      type: 'updateStep'
      payload: CreatePoolSteps
    }
  | { type: 'reset' }

const createPoolReducer = (state: CreatePoolState, action: CreatePoolAction) => {
  const { type } = action

  if (type === 'updatePool') {
    const { field, value } = action.payload
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return { ...state, [field as any]: value }
  }
  if (type === 'updateStep') {
    return { ...state, currentStep: action.payload }
  }
  if (type === 'reset') {
    return initialState
  }

  throw new Error(`Unknown action type: ${type}`)
}

export const getCreatePoolSummaryData = (
  createPoolState: CreatePoolState,
): { title: string; value: string | JSX.Element }[] =>
  createPoolConfigArr.map((step) => {
    let value: string | number | Token | Duration | undefined | JSX.Element =
      createPoolState[step.id]

    if (isDuration(value)) {
      if (step.id === CreatePoolSteps.dealDeadline) {
        value = createPoolState[CreatePoolSteps.dealDeadline] as Duration
        const valueWithInvestmentDeadline = sumDurations(
          createPoolState[CreatePoolSteps.investmentDeadLine] as Duration,
          value,
        )

        value = Object.values(value).some((val) => val > 0)
          ? getFormattedDurationFromNowToDuration(
              valueWithInvestmentDeadline,
              '~LLL dd, yyyy HH:mma',
            ) ?? '--'
          : `--`
      } else {
        try {
          value = Object.values(value).some((val) => !!val)
            ? getFormattedDurationFromNowToDuration(value, '~LLL dd, yyyy HH:mma') ?? '--'
            : undefined
        } catch (e) {
          value = undefined
        }
      }
    }

    if (isToken(value)) {
      value = (
        <TokenIcon
          address={value.address}
          network={value.chainId as ChainsValues}
          symbol={value.symbol}
          type="row"
        />
      )
    }

    if (step.id === CreatePoolSteps.sponsorFee && value !== '' && value !== undefined) {
      value = `${value}%`
    }

    if (step.id === CreatePoolSteps.poolCap && value === 0) {
      value = 'Uncapped'
    }

    if (step.id === CreatePoolSteps.poolPrivacy && typeof value === 'string') {
      value = value.charAt(0).toUpperCase() + value.slice(1)
    }

    if (!value) value = '--'

    return {
      title: step.title,
      value: value as JSX.Element | string,
    }
  })

export const getCreatePoolStepIndicatorData = (
  currentStep: CreatePoolSteps,
): { title: string; isActive: boolean }[] =>
  Object.values(CreatePoolSteps).map((step) => ({
    isActive: currentStep === step,
    title: createPoolConfig[step].title,
  }))

export default function useAelinCreatePool(chainId: ChainsValues) {
  const { appChainId } = useWeb3Connection()
  const prevAppChainId = usePrevious(appChainId)
  const [createPoolState, dispatch] = useReducer(createPoolReducer, initialState)
  const [errors, setErrors] = useState<poolErrors>()
  const [direction, setDirection] = useState<'next' | 'prev' | undefined>()
  const [showWarningOnLeave, setShowWarningOnLeave] = useState<boolean>(false)
  const router = useRouter()
  const { isSubmitting, setConfigAndOpenModal } = useTransactionModal()
  const { estimate: createPoolEstimate, execute } = useAelinPoolCreateTransaction(
    contracts.REGULAR_POOL_FACTORY.address[chainId],
    'createPool',
  )

  useEffect(() => {
    if (appChainId && prevAppChainId && prevAppChainId !== appChainId) dispatch({ type: 'reset' })
  }, [appChainId, prevAppChainId])

  const moveStep = (value: 'next' | 'prev') => {
    const { currentStep } = createPoolState
    const currentStepOrder = createPoolConfig[currentStep].order

    setDirection(value)

    if (value === 'next') {
      const nextStep = createPoolConfigArr.find(({ order }) => order === currentStepOrder + 1)
      return nextStep ? dispatch({ type: 'updateStep', payload: nextStep.id }) : null
    }

    if (value === 'prev') {
      const prevStep = createPoolConfigArr.find(({ order }) => order === currentStepOrder - 1)
      return prevStep ? dispatch({ type: 'updateStep', payload: prevStep.id }) : null
    }

    return dispatch({ type: 'updateStep', payload: value })
  }

  const handleCreatePool = async () => {
    const {
      allowListAddresses,
      allowListAmounts,
      duration,
      name,
      nftCollectionRules,
      purchaseDuration,
      purchaseToken,
      purchaseTokenCap,
      sponsorFee,
      symbol,
    } = parseValuesToCreatePool(createPoolState as CreatePoolStateComplete)

    setConfigAndOpenModal({
      estimate: () =>
        createPoolEstimate([
          {
            name,
            symbol,
            purchaseTokenCap,
            purchaseToken,
            duration,
            sponsorFee,
            purchaseDuration,
            allowListAddresses,
            allowListAmounts,
            nftCollectionRules,
          },
        ]),
      title: 'Create pool',
      onConfirm: async (txGasOptions: GasOptions) => {
        setShowWarningOnLeave(false)

        try {
          const receipt = await execute(
            [
              {
                name,
                symbol,
                purchaseTokenCap,
                purchaseToken,
                duration,
                sponsorFee,
                purchaseDuration,
                allowListAddresses,
                allowListAmounts,
                nftCollectionRules,
              },
            ],
            txGasOptions,
          )

          if (receipt) {
            router.push(`/pool/${getKeyChainByValue(chainId)}/${getPoolCreatedId(receipt)}`)
          }
        } catch (error) {
          console.log(error)
          setShowWarningOnLeave(true)
        }
      },
    })
  }

  const setPoolField = useCallback(
    (value: unknown, field?: CreatePoolValues | string) =>
      dispatch({
        type: 'updatePool',
        payload: { field: field || createPoolState.currentStep, value },
      }),
    [createPoolState.currentStep],
  )

  const isFinalStep = createPoolState.currentStep === CreatePoolSteps.poolPrivacy
  const isFirstStep = createPoolState.currentStep === CreatePoolSteps.poolName

  useEffect(() => {
    setErrors(validateCreatePool(createPoolState, chainId))
  }, [createPoolState, chainId])

  useEffect(() => {
    setShowWarningOnLeave(true)
  }, [createPoolState])

  return {
    createPoolState,
    direction,
    errors,
    handleCreatePool,
    isFinalStep,
    isFirstStep,
    isSubmitting,
    moveStep,
    setPoolField,
    showWarningOnLeave,
  }
}
