import { useRouter } from 'next/router'
import { ReactElement, useCallback, useEffect, useReducer, useRef, useState } from 'react'

import { isAddress } from '@ethersproject/address'
import { BigNumber } from '@ethersproject/bignumber'
import { parseUnits } from '@ethersproject/units'
import { Duration } from 'date-fns'

import { useAelinPoolTransaction } from '../contracts/useAelinPoolTransaction'
import { ChainsValues } from '@/src/constants/chains'
import { ZERO_BN } from '@/src/constants/misc'
import { Token, isToken } from '@/src/constants/token'
import { ParsedAelinPool } from '@/src/hooks/aelin/useAelinPool'
import { GasOptions, useModalTransaction } from '@/src/providers/modalTransactionProvider'
import { useWeb3Connection } from '@/src/providers/web3ConnectionProvider'
import { getDuration, getFormattedDurationFromNowToDuration } from '@/src/utils/date'
import { getERC20Data } from '@/src/utils/getERC20Data'
import { isDuration } from '@/src/utils/isDuration'
import removeNullsFromObject from '@/src/utils/removeNullsFromObject'
import { shortenAddress } from '@/src/utils/string'
import validateCreateDeal, { dealErrors } from '@/src/utils/validate/createDeal'

export enum CreateDealSteps {
  dealToken = 'dealToken',
  dealTokenTotal = 'dealTokenTotal',
  totalPurchaseAmount = 'totalPurchaseAmount',
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
}

export interface CreateDealState {
  dealToken: Token | undefined
  dealTokenTotal: string | undefined
  totalPurchaseAmount: string | undefined
  vestingCliff: Duration | undefined
  vestingPeriod: Duration | undefined
  proRataPeriod: Duration | undefined
  openPeriod: Duration | undefined
  counterPartyFundingPeriod: Duration | undefined
  counterPartyAddress: string | undefined
  currentStep: CreateDealSteps
}

export const createDealConfig: Record<CreateDealSteps, CreateDealStepInfo> = {
  [CreateDealSteps.dealToken]: {
    id: CreateDealSteps.dealToken,
    order: 1,
    title: 'Deal token',
    text: 'Copy and paste the deal token address (ERC-20) that is being presented to the pool as your deal. Examples - SNX Address (0x8700daec35af8ff88c16bdf0418774cb3d7599b4)',
    placeholder: 'Enter deal token address',
  },
  [CreateDealSteps.dealTokenTotal]: {
    id: CreateDealSteps.dealTokenTotal,
    order: 2,
    title: 'Deal token total',
    text: 'Total amount of deal tokens that are being distributed to the pool. This determines the exchange rate between investment tokens and deal tokens.',
    placeholder: 'Enter deal token total...',
  },
  [CreateDealSteps.totalPurchaseAmount]: {
    id: CreateDealSteps.totalPurchaseAmount,
    order: 3,
    title: 'Total purchase amount',
    text: (
      <>
        "All" - Every purchase token will be exchanged for a deal token, no investor will be
        deallocated. <br />
        <br /> "Partial" - Only a certain number of investment tokens will be exchanged for deal
        tokens. All pool investors are deallocated the same amount, no one receives preferential
        treatment.'
      </>
    ),

    placeholder: 'Enter total purchase amount...',
  },
  [CreateDealSteps.vestingCliff]: {
    id: CreateDealSteps.vestingCliff,
    order: 4,
    title: 'Vesting cliff',
    text: 'Investors will not begin vesting any deal tokens until this point.',
    placeholder: undefined,
  },
  [CreateDealSteps.vestingPeriod]: {
    id: CreateDealSteps.vestingPeriod,
    order: 5,
    title: 'Vesting period',
    text: 'How long after the vesting cliff (if applicable), tokens will vest for. They will be unlocked linearly over this time.',
    placeholder: undefined,
  },
  [CreateDealSteps.proRataPeriod]: {
    id: CreateDealSteps.proRataPeriod,
    order: 6,
    title: 'Pro rata period',
    text: 'Time period where investors confirm their allocation of deal tokens. We recommend giving investors ample time so they do not miss accepting tokens. Note - If investors do not accept their pro rata period, they will effectively decline the deal.',
    placeholder: undefined,
  },
  [CreateDealSteps.openPeriod]: {
    id: CreateDealSteps.openPeriod,
    order: 7,
    title: 'Open period',
    text: 'Everyone who maxed out their allocation in the Pro-Rata period is eligible to buy any remaining tokens with any leftover purchase tokens they have not withdrawn. Note: this period is based on first-come, first-serve.',
    placeholder: undefined,
  },
  [CreateDealSteps.counterPartyFundingPeriod]: {
    id: CreateDealSteps.counterPartyFundingPeriod,
    order: 8,
    title: 'Counter party funding period',
    text: 'Time period that the counter party (token holder) will have to deposit deal tokens to the pool. These tokens will be exchanged for investment tokens once their deposit is complete.',
    placeholder: undefined,
  },
  [CreateDealSteps.counterPartyAddress]: {
    id: CreateDealSteps.counterPartyAddress,
    order: 9,
    title: 'Counter party address',
    text: 'Copy and paste the EOA/multisig address for the counter party (token holder) who is depositing deal tokens. Note - Only this address will be able to deposit deal tokens, no other addresses can be added at a later time.',
    placeholder: 'Enter counter party address',
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
): { title: string; value: string }[] =>
  createDealConfigArr.map((step) => {
    let value = createDealState[step.id]

    if (isDuration(value)) {
      try {
        value = Object.values(value).some((val) => !!val)
          ? getFormattedDurationFromNowToDuration(value, 'LLL dd, yyyy HH:mma')
          : undefined
      } catch (e) {
        value = undefined
      }
    }

    if (isToken(value)) {
      value = shortenAddress(value?.address)
    }

    if (value && isAddress(value)) {
      value = shortenAddress(value)
    }

    if (!value) value = '--'

    return {
      title: step.title,
      value: value as string,
    }
  })

export const getCreateDealStepIndicatorData = (
  currentStep: CreateDealSteps,
): { title: string; isActive: boolean }[] =>
  Object.values(CreateDealSteps).map((step) => ({
    isActive: currentStep === step,
    title: createDealConfig[step].title,
  }))

const LOCAL_STORAGE_STATE_KEY = 'aelin-createDealState'
export default function useAelinCreateDeal(chainId: ChainsValues, pool: ParsedAelinPool) {
  const { readOnlyAppProvider } = useWeb3Connection()

  // Get saved state in localstorage only once
  const { current: savedState } = useRef(
    removeNullsFromObject(JSON.parse(localStorage.getItem(LOCAL_STORAGE_STATE_KEY) as string)),
  )
  const router = useRouter()

  const [createDealState, dispatch] = useReducer(createDealReducer, savedState || initialState)
  const [errors, setErrors] = useState<dealErrors>()
  const [investmentTokenInfo, setInvestmentTokenInfo] = useState<Token | null>(null)

  const { isSubmitting, setConfigAndOpenModal } = useModalTransaction()

  const { estimate: createDealEstimate, execute } = useAelinPoolTransaction(
    pool.address,
    'createDeal',
  )

  const moveStep = (value: 'next' | 'prev' | CreateDealSteps) => {
    const { currentStep } = createDealState
    const currentStepOrder = createDealConfig[currentStep].order

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
          dispatch({ type: 'reset' })
          router.reload()
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
          dealToken: dealToken?.address as string,
          dealTokenTotal: dealTokenTotal as string,
          totalPurchaseAmount: totalPurchaseAmount as string,
          vestingCliff: vestingCliff as Duration,
          vestingPeriod: vestingPeriod as Duration,
          proRataPeriod: proRataPeriod as Duration,
          openPeriod: openPeriod as Duration,
          counterPartyFundingPeriod: counterPartyFundingPeriod as Duration,
          counterPartyAddress: counterPartyAddress as string,
        },
        pool,
        chainId,
      ),
    )
    localStorage.setItem(
      LOCAL_STORAGE_STATE_KEY,
      JSON.stringify(createDealState, (k, v) => (v === undefined ? null : v)),
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

  return {
    setDealField,
    createDealState,
    moveStep,
    isFinalStep,
    errors,
    isFirstStep,
    isSubmitting,
    investmentTokenInfo,
    handleCreateDeal,
  }
}
