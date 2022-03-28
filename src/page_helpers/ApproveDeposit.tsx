import { useEffect, useState } from 'react'

import { BigNumber } from '@ethersproject/bignumber'

import { TokenInput } from '@/src/components/TokenInput'
import { ButtonPrimary } from '@/src/components/pureStyledComponents/buttons/Button'
import { ChainsValues } from '@/src/constants/chains'
import { MAX_BN, ZERO_ADDRESS, ZERO_BN } from '@/src/constants/misc'
import useERC20Call from '@/src/hooks/contracts/useERC20Call'
import useERC20Transaction from '@/src/hooks/contracts/useERC20Transaction'
import { useWeb3Connection } from '@/src/providers/web3ConnectionProvider'
import { formatToken } from '@/src/web3/bigNumber'
type Props = {
  chainId: ChainsValues
  investmentToken: string
  investmentTokenDecimals: number
}
export default function ApproveDeposit({
  chainId,
  investmentToken,
  investmentTokenDecimals,
}: Props) {
  const [tokenInputValue, setTokenInputValue] = useState('')
  const [inputError, setInputError] = useState('')
  const { address, isAppConnected } = useWeb3Connection()
  const [balance] = useERC20Call(chainId, investmentToken as string, 'balanceOf', [
    address || ZERO_ADDRESS,
  ])
  const approve = useERC20Transaction(investmentToken, 'approve')

  useEffect(() => {
    if (tokenInputValue && BigNumber.from(tokenInputValue).gt(MAX_BN)) {
      setInputError('Amount is too big')
    } else {
      setInputError('')
    }
  }, [tokenInputValue])

  const approveInvestmentToken = () => {
    if (inputError) {
      return
    }
    const tx = approve(investmentToken, tokenInputValue)
    tx.then(() => {
      setTokenInputValue('')
      setInputError('')
    })
  }

  return (
    <>
      <TokenInput
        balance={balance?.toString() || '0'}
        balanceFormatted={formatToken(balance || ZERO_BN, investmentTokenDecimals) as string}
        decimals={investmentTokenDecimals}
        error={Boolean(inputError)}
        hideMax
        setValue={setTokenInputValue}
        value={tokenInputValue}
      />
      <ButtonPrimary disabled={!address || !isAppConnected} onClick={approveInvestmentToken}>
        Approve
      </ButtonPrimary>
    </>
  )
}
