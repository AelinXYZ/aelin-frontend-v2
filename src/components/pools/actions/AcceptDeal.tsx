import { useEffect, useState } from 'react'
import styled from 'styled-components'

import { BigNumber, BigNumberish } from '@ethersproject/bignumber'

import { TokenInput } from '@/src/components/form/TokenInput'
import { genericSuspense } from '@/src/components/helpers/SafeSuspense'
import { Contents as BaseContents, Wrapper } from '@/src/components/pools/actions/Wrapper'
import { GradientButton } from '@/src/components/pureStyledComponents/buttons/Button'
import { ZERO_BN } from '@/src/constants/misc'
import useAelinDealUserStats from '@/src/hooks/aelin/useAelinDealUserStats'
import { ParsedAelinPool } from '@/src/hooks/aelin/useAelinPool'
import { useAelinPoolTransaction } from '@/src/hooks/contracts/useAelinPoolTransaction'
import { GasOptions, useTransactionModal } from '@/src/providers/transactionModalProvider'
import { useWeb3Connection } from '@/src/providers/web3ConnectionProvider'
import { formatToken } from '@/src/web3/bigNumber'

const Contents = styled(BaseContents)`
  margin-bottom: 20px;
`

type Props = {
  pool: ParsedAelinPool
}

function AcceptDeal({ pool }: Props) {
  const { investmentTokenDecimals } = pool

  const [tokenInputValue, setTokenInputValue] = useState('')
  const [inputError, setInputError] = useState('')
  const { address, isAppConnected } = useWeb3Connection()

  const { refetchUserStats, userMaxAllocation: userProRataAllocation } = useAelinDealUserStats(pool)

  const stage = pool.deal?.redemption?.stage
  if (!stage) {
    throw new Error("It's not possible to accept a deal at this pool stage.")
  }

  const { isSubmitting, setConfigAndOpenModal } = useTransactionModal()

  const { estimate: acceptDealEstimate, execute } = useAelinPoolTransaction(
    pool.address,
    'acceptDealTokens',
  )

  useEffect(() => {
    if (!userProRataAllocation.raw) {
      setInputError('User balance is not available!')
      return
    }
    if (
      tokenInputValue &&
      BigNumber.from(tokenInputValue).gt(userProRataAllocation.raw as BigNumberish)
    ) {
      setInputError('Insufficient balance')
    } else {
      setInputError('')
    }
  }, [tokenInputValue, userProRataAllocation.raw])

  const handleAcceptDeal = async () => {
    if (inputError) {
      return
    }

    setConfigAndOpenModal({
      onConfirm: async (txGasOptions: GasOptions) => {
        const receipt = await execute([tokenInputValue], txGasOptions)
        if (receipt) {
          refetchUserStats()
          setTokenInputValue('')
          setInputError('')
        }
      },
      title: 'Accept deal',
      estimate: () => acceptDealEstimate([tokenInputValue]),
    })
  }

  return (
    <Wrapper title={`Deal allocation stage ${stage}`}>
      <Contents>
        By clicking "accept deal" you are agreeing to the negotiated exchange rate.
      </Contents>
      <TokenInput
        decimals={investmentTokenDecimals}
        error={inputError}
        maxValue={(userProRataAllocation.raw || ZERO_BN).toString()}
        maxValueFormatted={
          formatToken(
            (userProRataAllocation.raw as BigNumberish) || ZERO_BN,
            investmentTokenDecimals,
          ) || '0'
        }
        setValue={setTokenInputValue}
        value={tokenInputValue}
      />
      <GradientButton
        disabled={
          !address || !isAppConnected || isSubmitting || !tokenInputValue || Boolean(inputError)
        }
        onClick={handleAcceptDeal}
      >
        Accept deal
      </GradientButton>
    </Wrapper>
  )
}

export default genericSuspense(AcceptDeal)
