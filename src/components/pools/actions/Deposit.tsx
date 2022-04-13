import { useEffect, useState } from 'react'

import { BigNumber } from '@ethersproject/bignumber'

import { TokenInput } from '@/src/components/pools/common/TokenInput'
import { GradientButton } from '@/src/components/pureStyledComponents/buttons/Button'
import { MAX_BN, ZERO_ADDRESS, ZERO_BN } from '@/src/constants/misc'
import { ParsedAelinPool } from '@/src/hooks/aelin/useAelinPool'
import useAelinPoolTransaction from '@/src/hooks/contracts/useAelinPoolTransaction'
import useERC20Call from '@/src/hooks/contracts/useERC20Call'
import { useWeb3Connection } from '@/src/providers/web3ConnectionProvider'
import { FundingState } from '@/src/utils/getAelinPoolCurrentStatus'
import { formatToken } from '@/src/web3/bigNumber'

type Props = {
  pool: ParsedAelinPool
  poolHelpers: FundingState
}

export default function Deposit({ pool, poolHelpers }: Props) {
  const { chainId, investmentToken, investmentTokenDecimals } = pool
  const [tokenInputValue, setTokenInputValue] = useState('')
  const [inputError, setInputError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
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

  const depositTokens = async () => {
    if (inputError) {
      return
    }

    setIsLoading(true)

    try {
      await purchasePoolTokens(tokenInputValue)
      refetchBalance()
      setTokenInputValue('')
      setInputError('')
      setIsLoading(false)
    } catch (error) {
      setIsLoading(false)
    }
  }

  const balances = [
    {
      raw: balance || ZERO_BN,
      formatted: formatToken(balance || ZERO_BN, pool.investmentTokenDecimals),
    },
    poolHelpers.meta.maxDepositAllowed,
  ].sort((a, b) => (a.raw.lt(b.raw) ? -1 : 1))

  return (
    <>
      <TokenInput
        decimals={investmentTokenDecimals}
        error={Boolean(inputError)}
        maxValue={balances[0].raw.toString()}
        maxValueFormatted={balances[0].formatted || '0'}
        setValue={setTokenInputValue}
        value={tokenInputValue}
      />
      <GradientButton
        disabled={
          !address ||
          !isAppConnected ||
          poolHelpers.meta.capReached ||
          isLoading ||
          !tokenInputValue ||
          Boolean(inputError)
        }
        onClick={depositTokens}
      >
        Deposit
      </GradientButton>
    </>
  )
}
