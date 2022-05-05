import { useEffect, useState } from 'react'

import { BigNumber, BigNumberish } from '@ethersproject/bignumber'

import { genericSuspense } from '@/src/components/helpers/SafeSuspense'
import { Contents, Wrapper } from '@/src/components/pools/actions/Wrapper'
import { GradientButton } from '@/src/components/pureStyledComponents/buttons/Button'
import { TokenInput } from '@/src/components/tokenInput/TokenInput'
import { ZERO_BN } from '@/src/constants/misc'
import { ParsedAelinPool } from '@/src/hooks/aelin/useAelinPool'
import { useAelinPoolTransaction } from '@/src/hooks/contracts/useAelinPoolTransaction'
import { useWeb3Connection } from '@/src/providers/web3ConnectionProvider'
import { formatToken } from '@/src/web3/bigNumber'
import { WaitingForDeal } from '@/types/aelinPool'

type Props = {
  pool: ParsedAelinPool
  dealing: WaitingForDeal
}

function AcceptDeal({ dealing, pool }: Props) {
  const { investmentTokenDecimals } = pool

  const [tokenInputValue, setTokenInputValue] = useState('')
  const [inputError, setInputError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const { address, isAppConnected } = useWeb3Connection()

  const stage = pool.deal?.redemption?.stage
  if (!stage) {
    throw new Error('There is not possible to accept deal at this pool stage.')
  }

  const { refetchUserStats, userProRataAllocation } = dealing

  const acceptDeal = useAelinPoolTransaction(pool.address, 'acceptDealTokens')

  useEffect(() => {
    if (!userProRataAllocation.raw) {
      setInputError('User balance is not available!')
      return
    }
    if (
      tokenInputValue &&
      BigNumber.from(tokenInputValue).gt(userProRataAllocation.raw as BigNumberish)
    ) {
      setInputError('Amount is too big')
    } else {
      setInputError('')
    }
  }, [tokenInputValue, userProRataAllocation.raw])

  const handleAcceptDeal = async () => {
    if (inputError) {
      return
    }

    setIsLoading(true)

    try {
      await acceptDeal([tokenInputValue])
      refetchUserStats()
      setTokenInputValue('')
      setInputError('')
      setIsLoading(false)
    } catch (error) {
      setIsLoading(false)
    }
  }

  return (
    <Wrapper>
      <Contents>
        <div>
          <div>Deal Allocation stage {stage}</div>
          <>By clicking "accept deal" you are agreeing to the negotiated exchange rate.</>
        </div>
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
          !address || !isAppConnected || isLoading || !tokenInputValue || Boolean(inputError)
        }
        onClick={handleAcceptDeal}
      >
        Accept deal
      </GradientButton>
    </Wrapper>
  )
}

export default genericSuspense(AcceptDeal)
