import { Dispatch, ReactNode, createContext, useContext, useEffect, useState } from 'react'

import { BigNumber } from '@ethersproject/bignumber'

import { useWeb3Connection } from './web3ConnectionProvider'
import { contracts } from '../constants/contracts'
import { BURN_AELIN_CONTRACT, NFT_WAIVER_CONTRACT, ZERO_ADDRESS, ZERO_BN } from '../constants/misc'
import useERC20Call from '../hooks/contracts/useERC20Call'
import { useNftWaiverCall } from '../hooks/contracts/useERC721Call'
import { useSwapAelinCall } from '../hooks/contracts/useSwapAelinCall'
import { formatToken } from '../web3/bigNumber'

type BurnAelinReducerContext = {
  state: BurnAelinState
  setState: Dispatch<BurnAelinState>
  setHasSwapped: Dispatch<boolean>
  setSwapTransactionHash: Dispatch<string>
  refetchNftContract: () => void
  refetchUserBalance: () => void
  refetchUserAllowance: () => void
  userBalance: BigNumber
  swapTransactionHash: string
  userReceiveAmtUSDC: string
  userReceiveAmtVK: string
}

export const BurnAelinState = {
  MINT: 'mint',
  APPROVE: 'approve',
  NO_BALANCE: 'no-balance',
  SWAP: 'swap',
  LOADING: 'loading',
  SUCCESS: 'success',
  ERROR: 'error',
} as const

export type BurnAelinState = (typeof BurnAelinState)[keyof typeof BurnAelinState]

const BuenAelinContext = createContext<BurnAelinReducerContext>({} as BurnAelinReducerContext)

const BurnAelinContextProvider = ({ children }: { children: ReactNode }) => {
  const { address, appChainId } = useWeb3Connection()
  const [state, setState] = useState<BurnAelinState>(BurnAelinState.MINT)
  const [hasSwapped, setHasSwapped] = useState<boolean>(false)
  const [swapTransactionHash, setSwapTransactionHash] = useState<string>('')

  const [hasMinted, refetchNftContract] = useNftWaiverCall(
    appChainId,
    NFT_WAIVER_CONTRACT,
    'hasMinted',
    [address || ZERO_ADDRESS],
  )

  const tokenAddress = contracts.AELIN_TOKEN.address[appChainId]

  const [userBalance, refetchUserBalance] = useERC20Call(appChainId, tokenAddress, 'balanceOf', [
    address || ZERO_ADDRESS,
  ])

  const [userAllowance, refetchUserAllowance] = useERC20Call(
    appChainId,
    tokenAddress,
    'allowance',
    [address || ZERO_ADDRESS, BURN_AELIN_CONTRACT],
  )

  const [userReceiveAmt, refecthUserReceiveAmt] = useSwapAelinCall(
    appChainId,
    BURN_AELIN_CONTRACT,
    'getSwapAmount',
    [userBalance || ZERO_BN],
  )

  const userReceiveAmtUSDC = formatToken(userReceiveAmt?.[0] || ZERO_BN, 6, 4) || ''
  const userReceiveAmtVK = formatToken(userReceiveAmt?.[1] || ZERO_BN, 18, 4) || ''

  useEffect(() => {
    if (!hasMinted) {
      setState(BurnAelinState.MINT)
    } else if (hasMinted && !userBalance?.gt(ZERO_BN) && !hasSwapped) {
      setState(BurnAelinState.NO_BALANCE)
    } else if (hasMinted && userBalance?.gt(ZERO_BN) && !userAllowance?.gt(ZERO_BN)) {
      setState(BurnAelinState.APPROVE)
    } else if (hasMinted && userBalance?.gt(ZERO_BN) && userAllowance?.gt(ZERO_BN)) {
      setState(BurnAelinState.SWAP)
    } else if (hasSwapped && swapTransactionHash) {
      setState(BurnAelinState.SUCCESS)
    } else {
      setState(BurnAelinState.ERROR)
    }
  }, [userBalance, userAllowance, hasMinted, hasSwapped, swapTransactionHash])

  return (
    <BuenAelinContext.Provider
      value={{
        state,
        setState,
        setHasSwapped,
        setSwapTransactionHash,
        swapTransactionHash,
        refetchNftContract,
        refetchUserBalance,
        refetchUserAllowance,
        userBalance: userBalance ?? ZERO_BN,
        userReceiveAmtUSDC,
        userReceiveAmtVK,
      }}
    >
      {children}
    </BuenAelinContext.Provider>
  )
}

export default BurnAelinContextProvider

export function useBurnAelin(): BurnAelinReducerContext {
  const context = useContext<BurnAelinReducerContext>(BuenAelinContext)

  if (!context) {
    throw new Error('Error on burnAelin context')
  }

  return context
}
