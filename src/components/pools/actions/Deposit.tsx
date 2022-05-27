import { useEffect, useState } from 'react'

import { BigNumber } from '@ethersproject/bignumber'

import { TokenInput } from '@/src/components/form/TokenInput'
import { genericSuspense } from '@/src/components/helpers/SafeSuspense'
import { GradientButton } from '@/src/components/pureStyledComponents/buttons/Button'
import { ParsedAelinPool } from '@/src/hooks/aelin/useAelinPool'
import { AmountTypes, useUserAvailableToDeposit } from '@/src/hooks/aelin/useUserAvailableToDeposit'
import { useAelinPoolTransaction } from '@/src/hooks/contracts/useAelinPoolTransaction'
import { GasOptions, useTransactionModal } from '@/src/providers/transactionModalProvider'
import { useWeb3Connection } from '@/src/providers/web3ConnectionProvider'
import { isPrivatePool } from '@/src/utils/aelinPoolUtils'
import { Funding } from '@/types/aelinPool'

type Props = {
  pool: ParsedAelinPool
  poolHelpers: Funding
}

function Deposit({ pool, poolHelpers }: Props) {
  const { investmentTokenDecimals, investmentTokenSymbol } = pool
  const { investmentTokenBalance, refetchBalances, userMaxDepositPrivateAmount } =
    useUserAvailableToDeposit(pool)
  const [tokenInputValue, setTokenInputValue] = useState('')
  const [inputError, setInputError] = useState('')
  const { address, isAppConnected } = useWeb3Connection()

  const { isSubmitting, setConfigAndOpenModal } = useTransactionModal()

  const { estimate: purchasePoolTokensEstimate, execute } = useAelinPoolTransaction(
    pool.address,
    'purchasePoolTokens',
  )

  const balances = [
    investmentTokenBalance,
    { ...poolHelpers.maxDepositAllowed, type: AmountTypes.maxDepositAllowed },
  ]

  const sortedBalances = !isPrivatePool(pool.poolType)
    ? balances.sort((a, b) => (a.raw.lt(b.raw) ? -1 : 1))
    : balances.concat(userMaxDepositPrivateAmount).sort((a, b) => (a.raw.lt(b.raw) ? -1 : 1))

  useEffect(() => {
    if (!investmentTokenBalance.raw) {
      setInputError('There was an error calculating User balance')
      return
    }

    const isInputError =
      tokenInputValue && BigNumber.from(tokenInputValue).gt(sortedBalances[0].raw)

    if (!isInputError) {
      setInputError('')
    } else {
      sortedBalances[0].type === AmountTypes.maxDepositAllowedPrivate
        ? setInputError(`Max allowed to invest is ${sortedBalances[0].formatted}`)
        : sortedBalances[0].type === AmountTypes.maxDepositAllowed
        ? setInputError(`Max cap allowance ${sortedBalances[0].formatted}`)
        : setInputError(`Insufficient balance`)
    }
  }, [investmentTokenBalance.raw, sortedBalances, tokenInputValue])

  const depositTokens = async () => {
    if (inputError) {
      return
    }

    setConfigAndOpenModal({
      onConfirm: async (txGasOptions: GasOptions) => {
        const receipt = await execute([tokenInputValue], txGasOptions)
        if (receipt) {
          refetchBalances()
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
        maxValue={sortedBalances[0].raw.toString()}
        maxValueFormatted={investmentTokenBalance.formatted || '0'}
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
