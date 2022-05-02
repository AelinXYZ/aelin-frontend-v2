import { useEffect, useState } from 'react'

import { BigNumber } from '@ethersproject/bignumber'

import { genericSuspense } from '@/src/components/helpers/SafeSuspense'
import { GradientButton } from '@/src/components/pureStyledComponents/buttons/Button'
import { TokenInput } from '@/src/components/tokenInput/TokenInput'
import { ZERO_BN } from '@/src/constants/misc'
import { ParsedAelinPool } from '@/src/hooks/aelin/useAelinPool'
import { useAelinPoolTxWithModal } from '@/src/hooks/contracts/useAelinPoolTransaction'
import { useWeb3Connection } from '@/src/providers/web3ConnectionProvider'
import { formatToken } from '@/src/web3/bigNumber'
import { Funding } from '@/types/aelinPool'

type Props = {
  pool: ParsedAelinPool
  poolHelpers: Funding
}

function Deposit({ pool, poolHelpers }: Props) {
  const { investmentTokenDecimals, investmentTokenSymbol } = pool
  const { refetchUserInvestmentTokenBalance, userInvestmentTokenBalance: balance } = poolHelpers
  const [tokenInputValue, setTokenInputValue] = useState('')
  const [inputError, setInputError] = useState('')
  const { address, isAppConnected } = useWeb3Connection()

  const {
    estimate: purchasePoolTokensEstimate,
    getModalTransaction,
    isSubmitting,
  } = useAelinPoolTxWithModal(pool.address, 'purchasePoolTokens')

  useEffect(() => {
    if (!balance) {
      setInputError('There was an error calculating User balance')
      return
    }

    if (tokenInputValue && BigNumber.from(tokenInputValue).gt(balance.raw)) {
      setInputError('Amount is too big')
    } else {
      setInputError('')
    }
  }, [tokenInputValue, balance])

  const depositTokens = async () => {
    if (inputError) {
      return
    }

    try {
      await purchasePoolTokensEstimate([tokenInputValue])
    } catch (error) {
      console.log(error)
    }
  }

  const balances = [
    {
      raw: balance.raw || ZERO_BN,
      formatted: formatToken(balance.raw || ZERO_BN, pool.investmentTokenDecimals),
    },
    poolHelpers.maxDepositAllowed,
  ].sort((a, b) => (a.raw.lt(b.raw) ? -1 : 1))

  return (
    <>
      <TokenInput
        decimals={investmentTokenDecimals}
        error={inputError}
        maxValue={balances[0].raw.toString()}
        maxValueFormatted={balances[0].formatted || '0'}
        setValue={setTokenInputValue}
        value={tokenInputValue}
      />
      <GradientButton
        disabled={
          !address ||
          !isAppConnected ||
          poolHelpers.capReached ||
          isSubmitting ||
          !tokenInputValue ||
          Boolean(inputError)
        }
        onClick={depositTokens}
      >
        Deposit
      </GradientButton>
      {getModalTransaction(`Deposit ${investmentTokenSymbol}`, () => {
        refetchUserInvestmentTokenBalance()
        setTokenInputValue('')
        setInputError('')
      })}
    </>
  )
}

export default genericSuspense(Deposit)
