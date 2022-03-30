import { useEffect, useState } from 'react'

import { BigNumber } from '@ethersproject/bignumber'

import { TokenInput } from '@/src/components/TokenInput'
import { ButtonPrimary } from '@/src/components/pureStyledComponents/buttons/Button'
import { ChainsValues } from '@/src/constants/chains'
import { MAX_BN, ZERO_ADDRESS, ZERO_BN } from '@/src/constants/misc'
import { ParsedAelinPool } from '@/src/hooks/aelin/useAelinPool'
import useAelinPoolTransaction from '@/src/hooks/contracts/useAelinPoolTransaction'
import useERC20Call from '@/src/hooks/contracts/useERC20Call'
import useERC20Transaction from '@/src/hooks/contracts/useERC20Transaction'
import { useWeb3Connection } from '@/src/providers/web3ConnectionProvider'
import { formatToken } from '@/src/web3/bigNumber'

type Props = {
  pool: ParsedAelinPool
}
export default function DepositPool({ pool }: Props) {
  const { chainId, investmentToken, investmentTokenDecimals } = pool
  const [tokenInputValue, setTokenInputValue] = useState('')
  const [inputError, setInputError] = useState('')
  const { address, isAppConnected } = useWeb3Connection()
  const [balance, refetchBalance] = useERC20Call(chainId, investmentToken as string, 'balanceOf', [
    address || ZERO_ADDRESS,
  ])
  const purchasePoolTokens = useAelinPoolTransaction(pool.address, 'purchasePoolTokens')

  useEffect(() => {
    if (tokenInputValue && BigNumber.from(tokenInputValue).gt(MAX_BN)) {
      setInputError('Amount is too big')
    } else {
      setInputError('')
    }
  }, [tokenInputValue])

  const approveInvestmentToken = async () => {
    if (inputError) {
      return
    }
    await purchasePoolTokens(tokenInputValue)
    refetchBalance()
    setTokenInputValue('')
    setInputError('')
  }

  return (
    <>
      <TokenInput
        balance={balance?.toString() || '0'}
        balanceFormatted={formatToken(balance || ZERO_BN, investmentTokenDecimals) as string}
        decimals={investmentTokenDecimals}
        error={Boolean(inputError)}
        setValue={setTokenInputValue}
        value={tokenInputValue}
      />
      <ButtonPrimary disabled={!address || !isAppConnected} onClick={approveInvestmentToken}>
        Deposit
      </ButtonPrimary>
    </>
  )
}
