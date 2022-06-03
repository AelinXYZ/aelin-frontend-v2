import { useRouter } from 'next/router'
import { ReactElement, useCallback, useEffect, useReducer, useState } from 'react'

import { isAddress } from '@ethersproject/address'
import { BigNumber } from '@ethersproject/bignumber'
import { parseUnits } from '@ethersproject/units'
import { Duration } from 'date-fns'
import isEqual from 'lodash/isEqual'

import { useAelinPoolTransaction } from '../contracts/useAelinPoolTransaction'
import { ChainsValues, getKeyChainByValue } from '@/src/constants/chains'
import { ZERO_BN } from '@/src/constants/misc'
import { Token } from '@/src/constants/token'
import { ParsedAelinPool } from '@/src/hooks/aelin/useAelinPool'
import { GasOptions, useTransactionModal } from '@/src/providers/transactionModalProvider'
import { useWeb3Connection } from '@/src/providers/web3ConnectionProvider'
import { getDuration, getFormattedDurationFromNowToDuration, sumDurations } from '@/src/utils/date'
import formatNumber from '@/src/utils/formatNumber'
import { getERC20Data } from '@/src/utils/getERC20Data'
import { shortenAddress } from '@/src/utils/string'
import validateCreateDeal, { dealErrors } from '@/src/utils/validate/createDeal'

export enum CreateDealSteps {
  dealToken = 'dealToken',
  totalPurchaseAmount = 'totalPurchaseAmount',
  dealTokenTotal = 'dealTokenTotal',
  vestingCliff = 'vestingCliff',
  vestingPeriod = 'vestingPeriod',
  proRataPeriod = 'proRataPeriod',
  openPeriod = 'openPeriod',
  counterPartyFundingPeriod = 'counterPartyFundingPeriod',
  counterPartyAddress = 'counterPartyAddress',
}

interface CreateDealStepInfo {
  order: number
  title: string
  text: string | ReactElement
  placeholder: string | undefined
  id: CreateDealSteps
  getSummaryValue: (...args: any) => string
}

export interface CreateDealState {
  dealToken: Token | undefined
  totalPurchaseAmount: string | undefined
  dealTokenTotal: string | undefined
  vestingCliff: Duration
  vestingPeriod: Duration
  proRataPeriod: Duration
  openPeriod: Duration
  counterPartyFundingPeriod: Duration
  counterPartyAddress: string | undefined
  currentStep: CreateDealSteps
}

export interface CreateDealStateComplete {
  dealToken: Token
  totalPurchaseAmount: string
  dealTokenTotal: string
  vestingCliff: Duration
  vestingPeriod: Duration
  proRataPeriod: Duration
  openPeriod: Duration
  counterPartyFundingPeriod: Duration
  counterPartyAddress: string
  currentStep: CreateDealSteps
}

const camelCaseToTitleCase = (str: string) => {
  const result = str.replace(/([A-Z])/g, ' $1')
  return result.toLocaleLowerCase()
}

export const createDealConfig: Record<CreateDealSteps, CreateDealStepInfo> = {
  [CreateDealSteps.dealToken]: {
    id: CreateDealSteps.dealToken,
    order: 1,
    title: 'Deal token',
    text: 'Copy and paste the deal token address (ERC-20) that is being presented to the pool for your deal.',
    placeholder: 'Enter deal token address',
    getSummaryValue: (currentState: CreateDealStateComplete) =>
      currentState[CreateDealSteps.dealToken].symbol,
  },

  [CreateDealSteps.totalPurchaseAmount]: {
    id: CreateDealSteps.totalPurchaseAmount,
    order: 2,
    title: 'Total investment amount',
    text: (
      <>
        You have two options for how many investment tokens you'll accept for the deal. <br />
        1- All: Every purchase token will be exchanged for a deal token.
        <br />
        2- Partial: A partial amount of investment tokens in the pool will be exchangeable for deal
        tokens
      </>
    ),
    placeholder: 'Enter total purchase amount...',
    getSummaryValue: (currentState: CreateDealStateComplete) =>
      formatNumber(Number(currentState[CreateDealSteps.totalPurchaseAmount])),
  },
  [CreateDealSteps.dealTokenTotal]: {
    id: CreateDealSteps.dealTokenTotal,
    order: 3,
    title: 'Deal token total',
    text: 'Amount of tokens for the deal, which determines the exchange rate',
    placeholder: 'Enter deal token total...',
    getSummaryValue: (currentState: CreateDealStateComplete) =>
      formatNumber(Number(currentState[CreateDealSteps.dealTokenTotal])),
  },

  [CreateDealSteps.vestingCliff]: {
    id: CreateDealSteps.vestingCliff,
    order: 4,
    title: 'Vesting cliff',
    text: 'Investors will not begin vesting any deal tokens until this point.',
    placeholder: undefined,
    getSummaryValue: (currentState: CreateDealStateComplete) => {
      const value = currentState[CreateDealSteps.vestingCliff]

      return (
        getFormattedDurationFromNowToDuration(value, '~LLL dd, yyyy HH:mma') ??
        `No ${camelCaseToTitleCase(CreateDealSteps.vestingCliff)}`
      )
    },
  },
  [CreateDealSteps.vestingPeriod]: {
    id: CreateDealSteps.vestingPeriod,
    order: 5,
    title: 'Vesting period',
    text: 'At the end of the vesting cliff, the period where deal tokens unlock linearly over time',
    placeholder: undefined,
    getSummaryValue: (currentState: CreateDealStateComplete) => {
      const value = currentState[CreateDealSteps.vestingPeriod]
      const valueWithVestingCliff = sumDurations(currentState[CreateDealSteps.vestingCliff], value)

      return Object.values(value).some((val) => val > 0)
        ? getFormattedDurationFromNowToDuration(valueWithVestingCliff, '~LLL dd, yyyy HH:mma') ||
            '--'
        : `No ${camelCaseToTitleCase(CreateDealSteps.vestingPeriod)}`
    },
  },
  [CreateDealSteps.proRataPeriod]: {
    id: CreateDealSteps.proRataPeriod,
    order: 6,
    title: 'Round 1: Accept Allocation',
    text: 'Round 1 is when investors may accept their allocation of deal tokens or reject the deal and receive their investment tokens back.',
    placeholder: undefined,
    getSummaryValue: (currentState: CreateDealStateComplete) => {
      const value = currentState[CreateDealSteps.proRataPeriod]

      return getFormattedDurationFromNowToDuration(value, '~LLL dd, yyyy HH:mma') ?? '--'
    },
  },
  [CreateDealSteps.openPeriod]: {
    id: CreateDealSteps.openPeriod,
    order: 7,
    title: 'Round 2: Accept Remaining',
    text: 'In Round 2, investors who accept their entire allocation in Round 1 can purchase any remaining tokens on a first-come, first-serve basis.',
    placeholder: undefined,
    getSummaryValue: (currentState: CreateDealStateComplete, isOpenPeriodDisabled): string => {
      const value = currentState[CreateDealSteps.openPeriod]
      const valueWithProRataPeriod = sumDurations(
        currentState[CreateDealSteps.proRataPeriod],
        value,
      )

      return Object.values(value).some((val) => val > 0)
        ? getFormattedDurationFromNowToDuration(valueWithProRataPeriod, '~LLL dd, yyyy HH:mma') ||
            '--'
        : isOpenPeriodDisabled
        ? `No ${camelCaseToTitleCase(CreateDealSteps.openPeriod)}`
        : `--`
    },
  },
  [CreateDealSteps.counterPartyFundingPeriod]: {
    id: CreateDealSteps.counterPartyFundingPeriod,
    order: 8,
    title: 'Token Holder Funding Period',
    text: 'Time period the token holder will have to deposit the total amount of deal tokens, which will be exchangeable for investment tokens',
    placeholder: undefined,
    getSummaryValue: (currentState: CreateDealStateComplete) => {
      const value = currentState[CreateDealSteps.counterPartyFundingPeriod]

      return getFormattedDurationFromNowToDuration(value, '~LLL dd, yyyy HH:mma') ?? `--`
    },
  },
  [CreateDealSteps.counterPartyAddress]: {
    id: CreateDealSteps.counterPartyAddress,
    order: 9,
    title: 'Token Holder Address',
    text: 'Copy and paste the EOA/multisig address for the token holder who is depositing deal tokens. Note - Only this address will be able to deposit deal tokens, no other addresses can be added at a later time.',
    placeholder: 'Enter counter party address',
    getSummaryValue: (currentState: CreateDealState): string => {
      const value = currentState[CreateDealSteps.counterPartyAddress] || ''
      return isAddress(value) ? shortenAddress(value) || '--' : '--'
    },
  },
}

export const createDealConfigArr = Object.values(createDealConfig)

type createDealValues = {
  underlyingDealToken: string
  underlyingDealTokenTotal: BigNumber
  purchaseTokenTotal: BigNumber
  vestingPeriodDuration: number
  vestingCliffDuration: number
  proRataRedemptionDuration: number
  openRedemptionDuration: number
  holderAddress: string
  holderFundingDuration: number
}

const parseValuesToCreateDeal = (
  createDealState: CreateDealState,
  investmentTokenDecimals: number,
): createDealValues => {
  const {
    counterPartyAddress,
    counterPartyFundingPeriod,
    dealToken,
    dealTokenTotal,
    openPeriod,
    proRataPeriod,
    totalPurchaseAmount,
    vestingCliff,
    vestingPeriod,
  } = createDealState
  const now = new Date()

  const proRataRedemptionDuration = getDuration(
    now,
    proRataPeriod?.days as number,
    proRataPeriod?.hours as number,
    proRataPeriod?.minutes as number,
  )

  const holderFundingDuration = getDuration(
    now,
    counterPartyFundingPeriod?.days as number,
    counterPartyFundingPeriod?.hours as number,
    counterPartyFundingPeriod?.minutes as number,
  )

  const openRedemptionDuration = getDuration(
    now,
    openPeriod?.days as number,
    openPeriod?.hours as number,
    openPeriod?.minutes as number,
  )

  const vestingPeriodDuration = getDuration(
    now,
    vestingPeriod?.days as number,
    vestingPeriod?.hours as number,
    vestingPeriod?.minutes as number,
  )

  const vestingCliffDuration = getDuration(
    now,
    vestingCliff?.days as number,
    vestingCliff?.hours as number,
    vestingCliff?.minutes as number,
  )

  return {
    underlyingDealToken: dealToken?.address as string,
    underlyingDealTokenTotal: dealTokenTotal
      ? parseUnits(dealTokenTotal.toString(), dealToken?.decimals)
      : ZERO_BN,
    purchaseTokenTotal: totalPurchaseAmount
      ? parseUnits(totalPurchaseAmount.toString(), investmentTokenDecimals)
      : ZERO_BN,
    vestingPeriodDuration,
    vestingCliffDuration,
    proRataRedemptionDuration,
    openRedemptionDuration,
    holderAddress: counterPartyAddress as string,
    holderFundingDuration,
  }
}

const initialState: CreateDealState = {
  [CreateDealSteps.dealToken]: undefined,
  [CreateDealSteps.dealTokenTotal]: undefined,
  [CreateDealSteps.totalPurchaseAmount]: undefined,
  [CreateDealSteps.vestingCliff]: { days: undefined, hours: undefined, minutes: undefined },
  [CreateDealSteps.vestingPeriod]: { days: undefined, hours: undefined, minutes: undefined },
  [CreateDealSteps.proRataPeriod]: { days: undefined, hours: undefined, minutes: undefined },
  [CreateDealSteps.openPeriod]: { days: undefined, hours: undefined, minutes: undefined },
  [CreateDealSteps.counterPartyFundingPeriod]: {
    days: undefined,
    hours: undefined,
    minutes: undefined,
  },
  [CreateDealSteps.counterPartyAddress]: '',
  currentStep: CreateDealSteps.dealToken,
}

type CreateDealAction =
  | {
      type: 'updateDeal'
      payload: {
        field: CreateDealSteps
        value: unknown
      }
    }
  | {
      type: 'updateStep'
      payload: CreateDealSteps
    }
  | { type: 'reset' }

const createDealReducer = (state: CreateDealState, action: CreateDealAction) => {
  const { type } = action

  if (type === 'updateDeal') {
    const { field, value } = action.payload
    return { ...state, [field]: value }
  }
  if (type === 'updateStep') {
    return { ...state, currentStep: action.payload }
  }
  if (type === 'reset') {
    return initialState
  }

  throw new Error(`Unknown action type: ${type}`)
}

export const getCreateDealSummaryData = (
  createDealState: CreateDealState,
  isOpenPeriodDisabled: boolean,
): { title: string; value: string }[] =>
  createDealConfigArr.map((step) => {
    let value = ''

    if (isEqual(createDealState[step.id], initialState[step.id])) {
      value = '--'
    }

    return {
      title: step.title,
      value: value || step.getSummaryValue(createDealState, isOpenPeriodDisabled),
    }
  })

export const getCreateDealStepIndicatorData = (
  currentStep: CreateDealSteps,
): { title: string; isActive: boolean }[] =>
  Object.values(CreateDealSteps).map((step) => ({
    isActive: currentStep === step,
    title: createDealConfig[step].title,
  }))

export default function useAelinCreateDeal(chainId: ChainsValues, pool: ParsedAelinPool) {
  const { readOnlyAppProvider } = useWeb3Connection()
  const router = useRouter()
  const [createDealState, dispatch] = useReducer(createDealReducer, initialState)
  const [errors, setErrors] = useState<dealErrors>()
  const [investmentTokenInfo, setInvestmentTokenInfo] = useState<Token | null>(null)
  const [direction, setDirection] = useState<'next' | 'prev' | undefined>()
  const [showWarningOnLeave, setShowWarningOnLeave] = useState<boolean>(false)
  const { isSubmitting, setConfigAndOpenModal } = useTransactionModal()
  const { estimate: createDealEstimate, execute } = useAelinPoolTransaction(
    pool.address,
    'createDeal',
  )

  const moveStep = (value: 'next' | 'prev') => {
    const { currentStep } = createDealState
    const currentStepOrder = createDealConfig[currentStep].order

    setDirection(value)

    if (value === 'next') {
      const nextStep = createDealConfigArr.find(({ order }) => order === currentStepOrder + 1)
      return nextStep ? dispatch({ type: 'updateStep', payload: nextStep.id }) : null
    }

    if (value === 'prev') {
      const prevStep = createDealConfigArr.find(({ order }) => order === currentStepOrder - 1)
      return prevStep ? dispatch({ type: 'updateStep', payload: prevStep.id }) : null
    }

    return dispatch({ type: 'updateStep', payload: value })
  }

  const handleCreateDeal = async () => {
    const {
      holderAddress,
      holderFundingDuration,
      openRedemptionDuration,
      proRataRedemptionDuration,
      purchaseTokenTotal,
      underlyingDealToken,
      underlyingDealTokenTotal,
      vestingCliffDuration,
      vestingPeriodDuration,
    } = parseValuesToCreateDeal(createDealState, pool.investmentTokenDecimals)

    try {
      await createDealEstimate([
        underlyingDealToken,
        purchaseTokenTotal,
        underlyingDealTokenTotal,
        vestingPeriodDuration,
        vestingCliffDuration,
        proRataRedemptionDuration,
        openRedemptionDuration,
        holderAddress,
        holderFundingDuration,
      ])
    } catch (e) {
      console.log(e)
    }

    setConfigAndOpenModal({
      estimate: () =>
        createDealEstimate([
          underlyingDealToken,
          purchaseTokenTotal,
          underlyingDealTokenTotal,
          vestingPeriodDuration,
          vestingCliffDuration,
          proRataRedemptionDuration,
          openRedemptionDuration,
          holderAddress,
          holderFundingDuration,
        ]),

      title: 'Create deal',
      onConfirm: async (txGasOptions: GasOptions) => {
        setShowWarningOnLeave(false)

        try {
          const receipt = await execute(
            [
              underlyingDealToken,
              purchaseTokenTotal,
              underlyingDealTokenTotal,
              vestingPeriodDuration,
              vestingCliffDuration,
              proRataRedemptionDuration,
              openRedemptionDuration,
              holderAddress,
              holderFundingDuration,
            ],
            txGasOptions,
          )
          if (receipt) {
            router.push(`/pool/${getKeyChainByValue(chainId)}/${pool.address}`)
          }
        } catch (error) {
          console.log(error)
          setShowWarningOnLeave(true)
        }
      },
    })
  }

  const setDealField = useCallback(
    (value: unknown) =>
      dispatch({
        type: 'updateDeal',
        payload: { field: createDealState.currentStep, value },
      }),
    [createDealState.currentStep],
  )

  const isFirstStep = createDealState.currentStep === CreateDealSteps.dealToken
  const isFinalStep = createDealState.currentStep === CreateDealSteps.counterPartyAddress

  useEffect(() => {
    const {
      counterPartyAddress,
      counterPartyFundingPeriod,
      dealToken,
      dealTokenTotal,
      openPeriod,
      proRataPeriod,
      totalPurchaseAmount,
      vestingCliff,
      vestingPeriod,
    } = createDealState

    setErrors(
      validateCreateDeal(
        {
          dealToken: dealToken?.address,
          dealTokenTotal: dealTokenTotal,
          totalPurchaseAmount: totalPurchaseAmount,
          vestingCliff: vestingCliff,
          vestingPeriod: vestingPeriod,
          proRataPeriod: proRataPeriod,
          openPeriod: openPeriod,
          counterPartyFundingPeriod: counterPartyFundingPeriod,
          counterPartyAddress: counterPartyAddress,
        },
        pool,
        chainId,
      ),
    )
  }, [createDealState, chainId, pool])

  useEffect(() => {
    const investmentTokenInfo = async () => {
      if (readOnlyAppProvider) {
        const investmentTokenData = await getERC20Data({
          address: pool.investmentToken,
          provider: readOnlyAppProvider,
        })
        setInvestmentTokenInfo(investmentTokenData)
      }
      return null
    }
    investmentTokenInfo()
  }, [pool.investmentToken, readOnlyAppProvider])

  useEffect(() => {
    setShowWarningOnLeave(!!createDealState.dealToken)
  }, [createDealState])

  return {
    createDealState,
    direction,
    errors,
    handleCreateDeal,
    investmentTokenInfo,
    isFinalStep,
    isFirstStep,
    isSubmitting,
    moveStep,
    setDealField,
    showWarningOnLeave,
  }
}
