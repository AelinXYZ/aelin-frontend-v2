import { useEffect, useMemo, useState } from 'react'

import { BigNumber } from '@ethersproject/bignumber'

import { TokenInput } from '@/src/components/form/TokenInput'
import { genericSuspense } from '@/src/components/helpers/SafeSuspense'
import { Contents, Wrapper } from '@/src/components/pools/actions/Wrapper'
import { ButtonGradient } from '@/src/components/pureStyledComponents/buttons/Button'
import { ZERO_ADDRESS, ZERO_BN } from '@/src/constants/misc'
import { ParsedAelinPool } from '@/src/hooks/aelin/useAelinPool'
import { useAelinPoolTransaction } from '@/src/hooks/contracts/useAelinPoolTransaction'
import useERC20Call from '@/src/hooks/contracts/useERC20Call'
import { GasOptions, useTransactionModal } from '@/src/providers/transactionModalProvider'
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

  const { isSubmitting, setConfigAndOpenModal } = useTransactionModal()

  const { estimate: withdrawFromPoolEstimate, execute } = useAelinPoolTransaction(
    pool.address,
    'withdrawFromPool',
  )

  useEffect(() => {
    if (!balance) {
      setInputError('User balance is not available!')
      return
    }
    if (tokenInputValue && BigNumber.from(tokenInputValue).gt(balance)) {
      setInputError('Insufficient balance')
    } else {
      setInputError('')
    }
  }, [tokenInputValue, balance])

  const withdrawFromPool = async () => {
    if (inputError) {
      return
    }
    setConfigAndOpenModal({
      onConfirm: async (txGasOptions: GasOptions) => {
        const receipt = await execute([tokenInputValue], txGasOptions)
        if (receipt) {
          refetchBalance()
          setTokenInputValue('')
          setInputError('')
        }
      },
      title: `Withdraw ${investmentTokenSymbol}`,
      estimate: () => withdrawFromPoolEstimate([tokenInputValue]),
    })
  }

  const maxValueFormatted = useMemo(
    () => formatToken(balance || ZERO_BN, investmentTokenDecimals) || '0',
    [balance, investmentTokenDecimals],
  )
  const disableButton = useMemo(
    () =>
      !address ||
      !isAppConnected ||
      isSubmitting ||
      !tokenInputValue ||
      Boolean(inputError) ||
      BigNumber.from(tokenInputValue).eq(0) ||
      !maxValueFormatted,
    [address, inputError, isAppConnected, isSubmitting, maxValueFormatted, tokenInputValue],
  )

  return (
    <Wrapper title="Withdraw">
      <Contents>
        The duration for this pool has ended. You may withdraw your funds now although the sponsor
        may still create a deal for you if you remain in the pool.
      </Contents>
      <TokenInput
        decimals={investmentTokenDecimals}
        error={inputError}
        maxValue={(balance || ZERO_BN).toString()}
        maxValueFormatted={maxValueFormatted}
        setValue={setTokenInputValue}
        symbol={investmentTokenSymbol}
        value={tokenInputValue}
      />
      <ButtonGradient disabled={disableButton} onClick={withdrawFromPool}>
        Withdraw
      </ButtonGradient>
    </Wrapper>
  )
}

export default genericSuspense(WithdrawalFromPool)
