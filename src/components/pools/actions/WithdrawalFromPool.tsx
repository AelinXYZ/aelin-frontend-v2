import { useEffect, useState } from 'react'

import { BigNumber } from '@ethersproject/bignumber'

import { genericSuspense } from '@/src/components/helpers/SafeSuspense'
import { GradientButton } from '@/src/components/pureStyledComponents/buttons/Button'
import { TokenInput } from '@/src/components/tokenInput/TokenInput'
import { ZERO_ADDRESS, ZERO_BN } from '@/src/constants/misc'
import { ParsedAelinPool } from '@/src/hooks/aelin/useAelinPool'
import { useAelinPoolTxWithModal } from '@/src/hooks/contracts/useAelinPoolTransaction'
import useERC20Call from '@/src/hooks/contracts/useERC20Call'
import { useWeb3Connection } from '@/src/providers/web3ConnectionProvider'
import { formatToken } from '@/src/web3/bigNumber'

type Props = {
  pool: ParsedAelinPool
}

function WithdrawalFromPool({ pool }: Props) {
  const { chainId, investmentTokenDecimals, investmentTokenSymbol } = pool

  const [tokenInputValue, setTokenInputValue] = useState('')
  const [inputError, setInputError] = useState('')
  const { address, isAppConnected } = useWeb3Connection()
  const [balance, refetchBalance] = useERC20Call(chainId, pool.address, 'balanceOf', [
    address || ZERO_ADDRESS,
  ])

  const {
    estimate: withdrawFromPoolEstimate,
    getModalTransaction,
    isSubmitting,
  } = useAelinPoolTxWithModal(pool.address, 'withdrawFromPool')

  useEffect(() => {
    if (!balance) {
      setInputError('User balance is not available!')
      return
    }
    if (tokenInputValue && BigNumber.from(tokenInputValue).gt(balance)) {
      setInputError('Amount is too big')
    } else {
      setInputError('')
    }
  }, [tokenInputValue, balance])

  const withdrawFromPool = async () => {
    if (inputError) {
      return
    }

    try {
      await withdrawFromPoolEstimate([tokenInputValue])
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <>
      <TokenInput
        decimals={investmentTokenDecimals}
        error={inputError}
        maxValue={(balance || ZERO_BN).toString()}
        maxValueFormatted={formatToken(balance || ZERO_BN, investmentTokenDecimals) || '0'}
        setValue={setTokenInputValue}
        value={tokenInputValue}
      />
      <GradientButton
        disabled={
          !address || !isAppConnected || isSubmitting || !tokenInputValue || Boolean(inputError)
        }
        onClick={withdrawFromPool}
      >
        Withdraw
      </GradientButton>
      {getModalTransaction(`Withdraw ${investmentTokenSymbol} from pool`, () => {
        refetchBalance()
        setTokenInputValue('')
        setInputError('')
      })}
    </>
  )
}

export default genericSuspense(WithdrawalFromPool)
