import { useEffect, useState } from 'react'

import { BigNumber } from '@ethersproject/bignumber'

import { TokenInput } from '@/src/components/form/TokenInput'
import { genericSuspense } from '@/src/components/helpers/SafeSuspense'
import { GradientButton } from '@/src/components/pureStyledComponents/buttons/Button'
import { ZERO_BN } from '@/src/constants/misc'
import { Privacy } from '@/src/constants/pool'
import { ParsedAelinPool } from '@/src/hooks/aelin/useAelinPool'
import { useAelinPoolTransaction } from '@/src/hooks/contracts/useAelinPoolTransaction'
import { GasOptions, useTransactionModal } from '@/src/providers/transactionModalProvider'
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

  const { isSubmitting, setConfigAndOpenModal } = useTransactionModal()

  const { estimate: purchasePoolTokensEstimate, execute } = useAelinPoolTransaction(
    pool.address,
    'purchasePoolTokens',
  )

  const balances = [
    {
      raw: balance.raw || ZERO_BN,
      formatted: formatToken(balance.raw || ZERO_BN, pool.investmentTokenDecimals),
    },
    poolHelpers.maxDepositAllowed,
  ].sort((a, b) => (a.raw.lt(b.raw) ? -1 : 1))

  useEffect(() => {
    if (!balances[0].raw) {
      setInputError('There was an error calculating User balance')
      return
    }

    if (
      pool.poolType.toLowerCase() === Privacy.PRIVATE &&
      tokenInputValue &&
      BigNumber.from(tokenInputValue).gt(poolHelpers.allowedList.userMaxAmount.raw)
    ) {
      setInputError(
        `Max allowed: ${poolHelpers.allowedList.userMaxAmount.formatted} ${pool.investmentTokenSymbol}`,
      )
    } else if (tokenInputValue && BigNumber.from(tokenInputValue).gt(balances[0].raw)) {
      setInputError('Insufficient balance')
    } else {
      setInputError('')
    }
  }, [
    tokenInputValue,
    poolHelpers.allowedList,
    pool.poolType,
    pool.investmentTokenSymbol,
    balances,
  ])

  const depositTokens = async () => {
    if (inputError) {
      return
    }

    setConfigAndOpenModal({
      onConfirm: async (txGasOptions: GasOptions) => {
        const receipt = await execute([tokenInputValue], txGasOptions)
        if (receipt) {
          refetchUserInvestmentTokenBalance()
          setTokenInputValue('')
          setInputError('')
        }
      },
      title: `Deposit ${investmentTokenSymbol}`,
      estimate: () => purchasePoolTokensEstimate([tokenInputValue]),
    })
  }

  return (
    <>
      <TokenInput
        decimals={investmentTokenDecimals}
        error={inputError}
        maxValue={balances[0].raw.toString()}
        maxValueFormatted={balances[0].formatted || '0'}
        setValue={setTokenInputValue}
        symbol={investmentTokenSymbol}
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
    </>
  )
}

export default genericSuspense(Deposit)
