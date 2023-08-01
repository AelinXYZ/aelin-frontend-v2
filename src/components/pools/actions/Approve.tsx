import styled from 'styled-components'

import { BigNumber } from '@ethersproject/bignumber'

import { TextPrimary } from '../../pureStyledComponents/text/Text'
import { Contents } from '@/src/components/pools/actions/Wrapper'
import { ButtonGradient } from '@/src/components/pureStyledComponents/buttons/Button'
import { Error as BaseError } from '@/src/components/pureStyledComponents/text/Error'
import { MAX_BN, ZERO_ADDRESS } from '@/src/constants/misc'
import useERC20Call from '@/src/hooks/contracts/useERC20Call'
import useERC20Transaction from '@/src/hooks/contracts/useERC20Transaction'
import { GasOptions, useTransactionModal } from '@/src/providers/transactionModalProvider'
import { useWeb3Connection } from '@/src/providers/web3ConnectionProvider'

const ButtonsWrapper = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;
  margin-top: 15px;
`

type Props = {
  tokenAddress: string
  spender: string
  title: string
  description: string
  refetchAllowance: () => void
  approveAmt?: BigNumber
  allowance?: string
  symbol?: string
  noEnoughBalance?: boolean
}

const Allowance = ({ allowance, symbol }: { allowance: string; symbol: string }) => (
  <Contents>
    Allowance:{' '}
    <TextPrimary>
      {allowance} {symbol}
    </TextPrimary>
  </Contents>
)

export default function Approve({
  allowance,
  approveAmt = MAX_BN,
  description,
  noEnoughBalance,
  refetchAllowance,
  spender,
  symbol,
  title,
  tokenAddress,
}: Props) {
  const { address, appChainId, isAppConnected } = useWeb3Connection()

  const { isSubmitting, setConfigAndOpenModal } = useTransactionModal()

  const { estimate, execute: approve } = useERC20Transaction(tokenAddress, 'approve')

  const [userBalance] = useERC20Call(appChainId, tokenAddress || ZERO_ADDRESS, 'balanceOf', [
    address || ZERO_ADDRESS,
  ])

  const approveInvestmentToken = async () => {
    setConfigAndOpenModal({
      onConfirm: async (txGasOptions: GasOptions) => {
        const receipt = await approve([spender, approveAmt], txGasOptions)
        if (receipt) {
          refetchAllowance()
        }
      },
      title: `${title}`,
      estimate: () => estimate([spender, approveAmt]),
    })
  }

  return (
    <>
      {allowance && symbol && <Allowance allowance={allowance} symbol={symbol} />}
      <Contents>{description}</Contents>
      <ButtonsWrapper>
        <ButtonGradient disabled={true} onClick={approveInvestmentToken}>
          Approve
        </ButtonGradient>
      </ButtonsWrapper>
      {noEnoughBalance && <BaseError textAlign="center">Insufficient balance</BaseError>}
      {!noEnoughBalance && !userBalance?.gt(0) && symbol && (
        <BaseError textAlign="center">You must have {symbol} in your wallet</BaseError>
      )}
    </>
  )
}
