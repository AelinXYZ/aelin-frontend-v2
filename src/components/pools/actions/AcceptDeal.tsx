import { useEffect, useState } from 'react'

import { BigNumber } from '@ethersproject/bignumber'

import { genericSuspense } from '@/src/components/helpers/SafeSuspense'
import { GradientButton } from '@/src/components/pureStyledComponents/buttons/Button'
import { TokenInput } from '@/src/components/tokenInput/TokenInput'
import { MAX_BN, ZERO_ADDRESS, ZERO_BN } from '@/src/constants/misc'
import { ParsedAelinPool } from '@/src/hooks/aelin/useAelinPool'
import { useAelinPoolTransaction } from '@/src/hooks/contracts/useAelinPoolTransaction'
import useERC20Call from '@/src/hooks/contracts/useERC20Call'
import { useWeb3Connection } from '@/src/providers/web3ConnectionProvider'
import { formatToken } from '@/src/web3/bigNumber'

type Props = {
  pool: ParsedAelinPool
}

function AcceptDeal({ pool }: Props) {
  const { chainId, investmentTokenDecimals } = pool

  const [tokenInputValue, setTokenInputValue] = useState('')
  const [inputError, setInputError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const { address, isAppConnected } = useWeb3Connection()
  const [balance, refetchBalance] = useERC20Call(chainId, pool.address, 'balanceOf', [
    address || ZERO_ADDRESS,
  ])
  const withdraw = useAelinPoolTransaction(pool.address, 'withdrawFromPool')

  useEffect(() => {
    if (tokenInputValue && BigNumber.from(tokenInputValue).gt(MAX_BN)) {
      setInputError('Amount is too big')
    } else {
      setInputError('')
    }
  }, [tokenInputValue])

  const withdrawFromPool = async () => {
    if (inputError) {
      return
    }

    setIsLoading(true)

    try {
      await withdraw(tokenInputValue)
      refetchBalance()
      setTokenInputValue('')
      setInputError('')
      setIsLoading(false)
    } catch (error) {
      setIsLoading(false)
    }
  }

  return (
    <>
      <div>Withdraw</div>
      <TokenInput
        decimals={investmentTokenDecimals}
        error={Boolean(inputError)}
        maxValue={(balance || ZERO_BN).toString()}
        maxValueFormatted={formatToken(balance || ZERO_BN, investmentTokenDecimals) || '0'}
        setValue={setTokenInputValue}
        value={tokenInputValue}
      />
      <GradientButton
        disabled={
          !address || !isAppConnected || isLoading || !tokenInputValue || Boolean(inputError)
        }
        onClick={withdrawFromPool}
      >
        Withdraw
      </GradientButton>
    </>
  )
}

export default genericSuspense(AcceptDeal)
