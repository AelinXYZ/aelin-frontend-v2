import { useCallback, useEffect, useReducer, useState } from 'react'

import { BigNumber } from '@ethersproject/bignumber'
import { MaxUint256 } from '@ethersproject/constants'
import { Contract } from '@ethersproject/contracts'
import { JsonRpcProvider } from '@ethersproject/providers'
import { parseEther, parseUnits } from '@ethersproject/units'

import erc20Abi from '@/src/abis/ERC20.json'
import { Duration } from '@/src/components/DeadlineInput'
import { ChainsValues } from '@/src/constants/chains'
import { contracts } from '@/src/constants/contracts'
import { Privacy } from '@/src/constants/pool'
import { Token } from '@/src/constants/token'
import useAelinPoolCreateTransaction from '@/src/hooks/contracts/useAelinPoolCreateTransaction'
import { useWeb3Connection } from '@/src/providers/web3ConnectionProvider'
import { getDuration } from '@/src/utils/date'
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
  investmentToken: Token | undefined
  investmentDeadLine: Duration | undefined
  dealDeadline: Duration | undefined
  poolCap: number | undefined
  sponsorFee: number | undefined
  poolPrivacy: Privacy | undefined
  currentStep: CreatePoolSteps
  whitelist: {
    address: string
    amount: number | null
    isSaved: boolean
  }[]
}

export const createPoolConfig: Record<CreatePoolSteps, CreatePoolStepInfo> = {
  [CreatePoolSteps.poolName]: {
    id: CreatePoolSteps.poolName,
    order: 1,
    title: 'Pool name',
    text: 'The name investors will see for the pool. This can be anything and will be one of the first values investors see.',
    placeholder: 'Choose a pool name...',
  },
  [CreatePoolSteps.poolSymbol]: {
    id: CreatePoolSteps.poolSymbol,
    order: 2,
    title: 'Pool symbol',
    text: 'Symbol that pool tokens will be named, should be similar to the pool name so investors can associate the two together.',
    placeholder: 'Enter pool symbol...',
  },
  [CreatePoolSteps.investmentToken]: {
    id: CreatePoolSteps.investmentToken,
    order: 3,
    title: 'Investment token',
    text: 'Copy and paste the address of the tokens investors will contribute to the pool in exchange for deal tokens. This can be any ERC-20 token. Some commonly used tokens, such as USDC, USDT, ETH, are already provided in the dropdown.',
    placeholder: 'USDC, USDT, ETH, etc...',
  },
  [CreatePoolSteps.investmentDeadLine]: {
    id: CreatePoolSteps.investmentDeadLine,
    order: 4,
    title: 'Investment deadline',
    text: 'Deadline investors will have to contribute investment tokens to the pool. Note - If this is a capped pool, investors will be unable to contribute if the cap is hit.',
    placeholder: 'USDC, USDT, ETH, etc...',
  },
  [CreatePoolSteps.dealDeadline]: {
    id: CreatePoolSteps.dealDeadline,
    order: 5,
    title: 'Deal deadline',
    text: 'Deadline sponsor will have to present a deal to the pool. Investors will be able to withdraw investment tokens if a deal is not presented by this time. Note - Deals can be presented after the deal deadline, though investors may have already withdrawn their investment tokens.',
    placeholder: undefined,
  },
  [CreatePoolSteps.poolCap]: {
    id: CreatePoolSteps.poolCap,
    order: 6,
    title: 'Pool cap',
    text: 'Maximum amount of investment tokens that can be contributed to the pool. Aelin protocol recommends to not set a cap so all investors have ample time to join the pool.',
    placeholder: 'Enter pool cap...',
  },
  [CreatePoolSteps.sponsorFee]: {
    id: CreatePoolSteps.sponsorFee,
    order: 7,
    title: 'Sponsor fee',
    text: "Fee that you, as the sponsor, will receive when investors accept the deal you've presented. If an investor declines the deal, they will not be charged a sponsor fee.",
    placeholder: 'Enter sponsor fee...',
  },
  [CreatePoolSteps.poolPrivacy]: {
    id: CreatePoolSteps.poolPrivacy,
    order: 8,
    title: 'Pool privacy',
    text: 'If you select Public, anyone will be able to join your pool, if you select Private you will input whitelisted addresses that can join this pool.',
    placeholder: undefined,
  },
}

export const createPoolConfigArr = Object.values(createPoolConfig)

const defaultErrors = {
  [CreatePoolSteps.poolName]: '',
  [CreatePoolSteps.poolSymbol]: '',
  [CreatePoolSteps.investmentToken]: '',
  [CreatePoolSteps.investmentDeadLine]: '',
  [CreatePoolSteps.dealDeadline]: '',
  [CreatePoolSteps.poolCap]: '',
  [CreatePoolSteps.sponsorFee]: '',
  [CreatePoolSteps.poolPrivacy]: '',
  whiteList: '',
}

type createPoolValues = {
  poolName: string
  poolSymbol: string
  poolCap: BigNumber
  sponsorFee: BigNumber
  investmentDeadLineDuration: number
  dealDeadLineDuration: number
  investmentToken: string
  poolAddresses: string[]
  poolAddressesAmounts: BigNumber[]
}

const parseValuesToCreatePool = async (
  createPoolState: CreatePoolState,
  provider: JsonRpcProvider,
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
  const purchaseContract = new Contract(investmentToken?.address as string, erc20Abi, provider)
  const purchaseTokenDecimals = await purchaseContract.decimals()

  const investmentDeadLineDuration = getDuration(
    now,
    investmentDeadLine?.days as number,
    investmentDeadLine?.hours as number,
    investmentDeadLine?.minutes as number,
  )

  const dealDeadLineDuration = getDuration(
    now,
    dealDeadline?.days as number,
    dealDeadline?.hours as number,
    dealDeadline?.minutes as number,
  )

  let poolAddresses: string[] = []
  let poolAddressesAmounts: BigNumber[] = []

  if (poolPrivacy === Privacy.PRIVATE) {
    const formattedWhiteList = whitelist.reduce((accum, curr) => {
      const { address, amount } = curr

      if (!address.length) return accum

      accum.push({
        address,
        amount: amount ? parseUnits(String(amount), purchaseTokenDecimals) : MaxUint256,
      })

      return accum
    }, [] as { address: string; amount: BigNumber }[])

    poolAddresses = formattedWhiteList.map(({ address }) => address)
    poolAddressesAmounts = formattedWhiteList.map(({ amount }) => amount)
  }

  return {
    poolName,
    poolSymbol,
    poolCap: parseUnits((poolCap as number).toString(), purchaseTokenDecimals),
    sponsorFee: parseEther((sponsorFee as number).toString()),
    investmentDeadLineDuration,
    dealDeadLineDuration,
    investmentToken: investmentToken?.address as string,
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
  [CreatePoolSteps.poolCap]: undefined,
  [CreatePoolSteps.sponsorFee]: undefined,
  [CreatePoolSteps.poolPrivacy]: undefined,
  currentStep: CreatePoolSteps.poolName,
  whitelist: [],
}

type CreatePoolAction =
  | {
      type: 'updatePool'
      payload: {
        field: CreatePoolSteps
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

export default function useAelinCreatePool(chainId: ChainsValues) {
  const { readOnlyAppProvider } = useWeb3Connection()
  const [createPoolState, dispatch] = useReducer(createPoolReducer, initialState)
  const [errors, setErrors] = useState<poolErrors>()

  const createPoolTx = useAelinPoolCreateTransaction(
    contracts.POOL_CREATE.address[chainId],
    'createPool',
  )

  const moveStep = (value: 'next' | 'prev' | CreatePoolSteps) => {
    const { currentStep } = createPoolState
    const currentStepOrder = createPoolConfig[currentStep].order

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

  const handleSubmit = async () => {
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
    } = await parseValuesToCreatePool(createPoolState, readOnlyAppProvider)

    try {
      await createPoolTx(
        poolName,
        poolSymbol,
        poolCap,
        investmentToken,
        investmentDeadLineDuration,
        sponsorFee,
        dealDeadLineDuration,
        poolAddresses,
        poolAddressesAmounts,
      )
    } catch (e) {
      console.log(e)
    }
  }

  const setPoolField = useCallback(
    (field: CreatePoolSteps, value: unknown) =>
      dispatch({
        type: 'updatePool',
        payload: { field, value },
      }),
    [],
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
          dealDeadline: dealDeadline as Duration,
          investmentDeadLine: investmentDeadLine as Duration,
          investmentToken: investmentToken as Token,
          poolCap: poolCap as number,
          poolName,
          poolPrivacy: poolPrivacy as Privacy,
          poolSymbol,
          sponsorFee: sponsorFee as number,
          whitelist,
        },
        chainId,
      ),
    )
  }, [createPoolState, chainId])

  return { setPoolField, createPoolState, moveStep, isFinalStep, errors, isFirstStep, handleSubmit }
}
