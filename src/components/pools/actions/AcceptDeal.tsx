import { useEffect, useState } from 'react'

import { BigNumber, BigNumberish } from '@ethersproject/bignumber'

import { genericSuspense } from '@/src/components/helpers/SafeSuspense'
import { Contents, Wrapper } from '@/src/components/pools/actions/Wrapper'
import { GradientButton } from '@/src/components/pureStyledComponents/buttons/Button'
import { TokenInput } from '@/src/components/tokenInput/TokenInput'
import { MAX_BN, ZERO_ADDRESS, ZERO_BN } from '@/src/constants/misc'
import { ParsedAelinPool } from '@/src/hooks/aelin/useAelinPool'
import useAelinPoolCall from '@/src/hooks/contracts/useAelinPoolCall'
import { useAelinPoolTransaction } from '@/src/hooks/contracts/useAelinPoolTransaction'
import { useWeb3Connection } from '@/src/providers/web3ConnectionProvider'
import { formatToken } from '@/src/web3/bigNumber'
import { AelinPool } from '@/types/typechain'

type Props = {
  pool: ParsedAelinPool
}

function AcceptDeal({ pool }: Props) {
  const { chainId, investmentTokenDecimals } = pool

  const [tokenInputValue, setTokenInputValue] = useState('')
  const [inputError, setInputError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const { address, isAppConnected } = useWeb3Connection()

  const stage = pool.deal?.redemption?.stage
  if (!stage) {
    throw new Error('There is not possible to accept deal at this pool stage.')
  }

  const [balance, refetchBalance] = useAelinPoolCall(
    chainId,
    pool.address,
    (stage === 1 ? 'maxProRataAmount' : 'maxOpenAvail') as keyof AelinPool['functions'],
    [address || ZERO_ADDRESS],
  )

  const acceptDeal = useAelinPoolTransaction(pool.address, 'acceptDealTokens')

  useEffect(() => {
    if (!balance) {
      setInputError('User balance is not available!')
      return
    }
    if (tokenInputValue && BigNumber.from(tokenInputValue).gt(balance as BigNumberish)) {
      setInputError('Amount is too big')
    } else {
      setInputError('')
    }
  }, [tokenInputValue, balance])

  const withdrawFromPool = async () => {
    if (inputError) {
      return
    }

    setIsLoading(true)

    try {
      await acceptDeal([tokenInputValue])
      refetchBalance()
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
        maxValue={(balance || ZERO_BN).toString()}
        maxValueFormatted={
          formatToken((balance as BigNumberish) || ZERO_BN, investmentTokenDecimals) || '0'
        }
        setValue={setTokenInputValue}
        value={tokenInputValue}
      />
      <GradientButton
        disabled={
          !address || !isAppConnected || isLoading || !tokenInputValue || Boolean(inputError)
        }
        onClick={withdrawFromPool}
      >
        Accept deal
      </GradientButton>
    </Wrapper>
  )
}

export default genericSuspense(AcceptDeal)
