import { FC, useEffect, useMemo, useState } from 'react'
import styled from 'styled-components'

import { BigNumber } from '@ethersproject/bignumber'
import { MaxUint256 } from '@ethersproject/constants'

import { DEPOSIT_TYPE, WITHDRAW_TYPE } from './kind'
import { GradientButton } from '@/src/components/pureStyledComponents/buttons/Button'
import { TabContent } from '@/src/components/tabs/Tabs'
import { TokenInput } from '@/src/components/tokenInput/TokenInput'
import { ZERO_ADDRESS, ZERO_BN } from '@/src/constants/misc'
import useERC20Call from '@/src/hooks/contracts/useERC20Call'
import useERC20Transaction from '@/src/hooks/contracts/useERC20Transaction'
import useStakingRewardsCall from '@/src/hooks/contracts/useStakingRewardsCall'
import useStakingRewardsTransaction from '@/src/hooks/contracts/useStakingRewardsTransaction'
import { useWeb3Connection } from '@/src/providers/web3ConnectionProvider'
import { formatToken } from '@/src/web3/bigNumber'

interface StakeTabContentProps {
  type: typeof DEPOSIT_TYPE | typeof WITHDRAW_TYPE
  decimals: number
  stakingAddress: string
  symbol?: string
  tokenAddress: string
}

const StyledGradientButton = styled(GradientButton)`
  width: 160px;
`

const StakeTabContent: FC<StakeTabContentProps> = ({
  decimals,
  stakingAddress,
  symbol,
  tokenAddress,
  type,
}) => {
  const [isLoading, setIsLoading] = useState(false)
  const [inputError, setInputError] = useState('')
  const [tokenInputValue, setTokenInputValue] = useState('')

  const { address, appChainId, isAppConnected } = useWeb3Connection()

  const [allowance, refetchAllowance] = useERC20Call(appChainId, tokenAddress, 'allowance', [
    address || ZERO_ADDRESS,
    stakingAddress,
  ])

  const [balanceOf, refetchBalanceOf] = useERC20Call(appChainId, tokenAddress, 'balanceOf', [
    address || ZERO_ADDRESS,
  ])

  const [userStake] = useStakingRewardsCall(appChainId, stakingAddress, 'balanceOf', [
    address || ZERO_ADDRESS,
  ])

  const approve = useERC20Transaction(tokenAddress, 'approve')
  const stake = useStakingRewardsTransaction(stakingAddress, 'stake')
  const withdraw = useStakingRewardsTransaction(stakingAddress, 'withdraw')

  const totalBalance = useMemo(() => {
    if (type === DEPOSIT_TYPE) {
      return balanceOf
    }
    if (type === WITHDRAW_TYPE) {
      return userStake
    }

    console.error('Unknown type')
    return ZERO_BN
  }, [type, balanceOf, userStake])

  const hasAllowance = useMemo(() => {
    return allowance?.gt(ZERO_ADDRESS) ?? false
  }, [allowance])

  useEffect(() => {
    if (tokenInputValue && BigNumber.from(tokenInputValue).gt(MaxUint256)) {
      setInputError('Amount is too big')
      return
    }
    if (tokenInputValue && BigNumber.from(tokenInputValue).gt(totalBalance ?? ZERO_BN)) {
      setInputError('Amount is bigger than your balance')
      return
    }

    setInputError('')
  }, [totalBalance, tokenInputValue])

  const handleApprove = async () => {
    setIsLoading(true)
    try {
      await approve(stakingAddress, MaxUint256)
      refetchAllowance()
      setIsLoading(false)
    } catch (error) {
      console.error(error)
      setIsLoading(false)
    }
  }

  const handleDeposit = async () => {
    setIsLoading(true)
    try {
      await stake(tokenInputValue)
      refetchAllowance()
      refetchBalanceOf()
      setTokenInputValue('')
      setInputError('')
      setIsLoading(false)
    } catch (error) {
      console.error(error)
      setIsLoading(false)
    }
  }

  const handleWithdraw = async () => {
    setIsLoading(true)
    try {
      await withdraw(tokenInputValue)
      refetchAllowance()
      refetchBalanceOf()
      setTokenInputValue('')
      setInputError('')
      setIsLoading(false)
    } catch (error) {
      console.error(error)
      setIsLoading(false)
    }
  }

  return (
    <TabContent>
      <TokenInput
        decimals={decimals ?? 18}
        error={Boolean(inputError)}
        maxValue={totalBalance?.toString() ?? '0'}
        maxValueFormatted={formatToken(totalBalance ?? ZERO_BN, decimals ?? 18) ?? '0'}
        setValue={setTokenInputValue}
        symbol={symbol}
        value={tokenInputValue}
      />
      <StyledGradientButton
        disabled={!address || !isAppConnected || hasAllowance || isLoading}
        onClick={handleApprove}
      >
        Approve
      </StyledGradientButton>
      <br />
      <StyledGradientButton
        disabled={
          !address ||
          !isAppConnected ||
          !tokenInputValue ||
          Boolean(inputError) ||
          !hasAllowance ||
          isLoading
        }
        onClick={type === DEPOSIT_TYPE ? handleDeposit : handleWithdraw}
      >
        {type === DEPOSIT_TYPE ? 'Deposit' : 'Withdraw'}
      </StyledGradientButton>
    </TabContent>
  )
}

export default StakeTabContent
