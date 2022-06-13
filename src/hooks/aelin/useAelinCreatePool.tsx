import { useRouter } from 'next/router'
import { useCallback, useEffect, useReducer, useState } from 'react'

import { BigNumber } from '@ethersproject/bignumber'
import { BigNumberish } from '@ethersproject/bignumber'
import { MaxUint256 } from '@ethersproject/constants'
import { parseEther, parseUnits } from '@ethersproject/units'

import { TokenIcon } from '@/src/components/pools/common/TokenIcon'
import { AddressWhitelistProps } from '@/src/components/pools/whitelist/addresses/AddressesWhiteList'
import { ChainsValues, getKeyChainByValue } from '@/src/constants/chains'
import { contracts } from '@/src/constants/contracts'
import { ZERO_BN } from '@/src/constants/misc'
import { Privacy } from '@/src/constants/pool'
import { Token, isToken } from '@/src/constants/token'
import {
  getPoolCreatedId,
  useAelinPoolCreateTransaction,
} from '@/src/hooks/contracts/useAelinPoolCreateTransaction'
import { GasOptions, useTransactionModal } from '@/src/providers/transactionModalProvider'
import { getDuration, getFormattedDurationFromNowToDuration, sumDurations } from '@/src/utils/date'
import { isDuration } from '@/src/utils/isDuration'
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
  poolName: string
  poolSymbol: string
  investmentToken?: Token
  investmentDeadLine?: Duration
  dealDeadline?: Duration
  poolCap?: number
  sponsorFee?: number
  poolPrivacy?: Privacy
  currentStep: CreatePoolSteps
  whitelist: AddressWhitelistProps[]
}

export interface CreatePoolStateComplete {
  poolName: string
  poolSymbol: string
  investmentToken: Token
  investmentDeadLine: { days: number; hours: number; minutes: number }
  dealDeadline: { days: number; hours: number; minutes: number }
  poolCap?: number
  sponsorFee?: number
  poolPrivacy: Privacy
  currentStep: CreatePoolSteps
  whitelist: {
    address: string
    amount: number
  }[]
}

type CreatePoolValues = keyof CreatePoolState

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
    title: 'Pool privacy',
    text: 'If Public, anyone will be able to join the pool. If Private, only whitelisted addresses can join the pool.',
    placeholder: undefined,
  },
}

export const createPoolConfigArr = Object.values(createPoolConfig)

type createPoolValues = {
  poolName: string
  poolSymbol: string
  poolCap: BigNumberish
  sponsorFee: BigNumberish
  investmentDeadLineDuration: number
  dealDeadLineDuration: number
  investmentToken: string
  poolAddresses: string[]
  poolAddressesAmounts: BigNumber[]
}

const parseValuesToCreatePool = async (
  createPoolState: CreatePoolStateComplete,
): Promise<createPoolValues> => {
  const {
    dealDeadline,
    investmentDeadLine,
    investmentToken,
    poolCap,
    poolName,
    poolPrivacy,
    poolSymbol,
    sponsorFee,
    whitelist,
  } = createPoolState
  const now = new Date()
  const investmentDeadLineDuration = getDuration(
    now,
    investmentDeadLine.days,
    investmentDeadLine.hours,
    investmentDeadLine.minutes,
  )

  const dealDeadLineDuration = getDuration(
    now,
    dealDeadline.days,
    dealDeadline.hours,
    dealDeadline.minutes,
  )

  let poolAddresses: string[] = []
  let poolAddressesAmounts: BigNumber[] = []

  if (poolPrivacy === Privacy.PRIVATE) {
    const formattedWhiteList = whitelist.reduce((accum, curr) => {
      const { address, amount } = curr

      if (!address.length) return accum

      accum.push({
        address,
        amount: amount ? parseUnits(String(amount), investmentToken.decimals) : MaxUint256,
      })

      return accum
    }, [] as { address: string; amount: BigNumber }[])

    poolAddresses = formattedWhiteList.map(({ address }) => address)
    poolAddressesAmounts = formattedWhiteList.map(({ amount }) => amount)
  }

  return {
    poolName,
    poolSymbol,
    poolCap: poolCap ? parseUnits(poolCap.toString(), investmentToken?.decimals) : ZERO_BN,
    sponsorFee: sponsorFee ? parseEther(sponsorFee?.toString()) : ZERO_BN,
    investmentDeadLineDuration,
    dealDeadLineDuration,
    investmentToken: investmentToken.address,
    poolAddressesAmounts,
    poolAddresses,
  }
}

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
}

type CreatePoolAction =
  | {
      type: 'updatePool'
      payload: {
        field: CreatePoolValues
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
  const [createPoolState, dispatch] = useReducer(createPoolReducer, initialState)
  const [errors, setErrors] = useState<poolErrors>()
  const [direction, setDirection] = useState<'next' | 'prev' | undefined>()
  const [showWarningOnLeave, setShowWarningOnLeave] = useState<boolean>(false)
  const router = useRouter()
  const { isSubmitting, setConfigAndOpenModal } = useTransactionModal()
  const { estimate: createPoolEstimate, execute } = useAelinPoolCreateTransaction(
    contracts.POOL_CREATE.address[chainId],
    'createPool',
  )

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
      dealDeadLineDuration,
      investmentDeadLineDuration,
      investmentToken,
      poolAddresses,
      poolAddressesAmounts,
      poolCap,
      poolName,
      poolSymbol,
      sponsorFee,
    } = await parseValuesToCreatePool(createPoolState as CreatePoolStateComplete)

    setConfigAndOpenModal({
      estimate: () =>
        createPoolEstimate([
          poolName,
          poolSymbol,
          poolCap,
          investmentToken,
          dealDeadLineDuration,
          sponsorFee,
          investmentDeadLineDuration,
          poolAddresses,
          poolAddressesAmounts,
        ]),
      title: 'Create pool',
      onConfirm: async (txGasOptions: GasOptions) => {
        setShowWarningOnLeave(false)

        try {
          const receipt = await execute(
            [
              poolName,
              poolSymbol,
              poolCap,
              investmentToken,
              dealDeadLineDuration,
              sponsorFee,
              investmentDeadLineDuration,
              poolAddresses,
              poolAddressesAmounts,
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
    (value: unknown, field?: CreatePoolValues) =>
      dispatch({
        type: 'updatePool',
        payload: { field: field || createPoolState.currentStep, value },
      }),
    [createPoolState.currentStep],
  )

  const isFinalStep = createPoolState.currentStep === CreatePoolSteps.poolPrivacy
  const isFirstStep = createPoolState.currentStep === CreatePoolSteps.poolName

  useEffect(() => {
    const {
      dealDeadline,
      investmentDeadLine,
      investmentToken,
      poolCap,
      poolName,
      poolPrivacy,
      poolSymbol,
      sponsorFee,
      whitelist,
    } = createPoolState

    setErrors(
      validateCreatePool(
        {
          dealDeadline,
          investmentDeadLine,
          investmentToken,
          poolCap,
          poolName,
          poolPrivacy,
          poolSymbol,
          sponsorFee,
          whitelist,
        },
        chainId,
      ),
    )
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
