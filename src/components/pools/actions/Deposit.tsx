import { useEffect, useMemo, useState } from 'react'

import { BigNumber } from '@ethersproject/bignumber'

import { TokenInput } from '@/src/components/form/TokenInput'
import { genericSuspense } from '@/src/components/helpers/SafeSuspense'
import { ButtonGradient } from '@/src/components/pureStyledComponents/buttons/Button'
import { ZERO_ADDRESS, ZERO_BN } from '@/src/constants/misc'
import { ParsedAelinPool } from '@/src/hooks/aelin/useAelinPool'
import { useUserAllowList } from '@/src/hooks/aelin/useAelinUserAllowList'
import { useAelinPoolTransaction } from '@/src/hooks/contracts/useAelinPoolTransaction'
import useERC20Call from '@/src/hooks/contracts/useERC20Call'
import { GasOptions, useTransactionModal } from '@/src/providers/transactionModalProvider'
import { useWeb3Connection } from '@/src/providers/web3ConnectionProvider'
import { isPrivatePool } from '@/src/utils/aelinPoolUtils'
import { formatToken } from '@/src/web3/bigNumber'
import { Funding } from '@/types/aelinPool'

type Props = {
  pool: ParsedAelinPool
  poolHelpers: Funding
}

function Deposit({ pool, poolHelpers }: Props) {
  const { investmentTokenDecimals, investmentTokenSymbol } = pool
  const allowedList = useUserAllowList(pool)
  const [tokenInputValue, setTokenInputValue] = useState('')
  const [inputError, setInputError] = useState('')
  const { address, isAppConnected } = useWeb3Connection()

  const [balance, refetchUserInvestmentTokenBalance] = useERC20Call(
    pool.chainId,
    pool.investmentToken,
    'balanceOf',
    [address || ZERO_ADDRESS],
  )

  const { isSubmitting, setConfigAndOpenModal } = useTransactionModal()

  const { estimate: purchasePoolTokensEstimate, execute } = useAelinPoolTransaction(
    pool.address,
    'purchasePoolTokens',
  )

  const balances = [
    {
      raw: balance || ZERO_BN,
      formatted: formatToken(balance || ZERO_BN, pool.investmentTokenDecimals),
    },
    poolHelpers.maxDepositAllowed,
  ].sort((a, b) => (a.raw.lt(b.raw) ? -1 : 1))

  const isUserMaxAmountIsFromAllowedList =
    isPrivatePool(pool.poolType) && allowedList.userMaxAmount.raw.lt(balances[0].raw)

  const isAmountExceedsMax = useMemo(
    () =>
      isUserMaxAmountIsFromAllowedList
        ? tokenInputValue && BigNumber.from(tokenInputValue).gt(allowedList.userMaxAmount.raw)
        : tokenInputValue && BigNumber.from(tokenInputValue).gt(balances[0].raw),
    [isUserMaxAmountIsFromAllowedList, tokenInputValue, allowedList.userMaxAmount.raw, balances],
  )

  useEffect(() => {
    if (!balances[0].raw) {
      setInputError('There was an error calculating User balance')
      return
    }

    if (isAmountExceedsMax) {
      setInputError(
        isUserMaxAmountIsFromAllowedList
          ? `Max allowed: ${allowedList.userMaxAmount.formatted} ${pool.investmentTokenSymbol}`
          : 'Insufficient balance',
      )
    } else {
      setInputError('')
    }
  }, [
    allowedList.userMaxAmount.formatted,
    balances,
    isAmountExceedsMax,
    isUserMaxAmountIsFromAllowedList,
    pool.investmentTokenSymbol,
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
      <ButtonGradient
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
      </ButtonGradient>
    </>
  )
}

export default genericSuspense(Deposit)
