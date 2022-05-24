import { FC, useEffect, useMemo, useState } from 'react'
import styled from 'styled-components'

import { BigNumber } from '@ethersproject/bignumber'
import { MaxUint256 } from '@ethersproject/constants'

import { DEPOSIT_TYPE, WITHDRAW_TYPE } from '../../constants/types'
import { TokenInput as BaseTokenInput } from '@/src/components/form/TokenInput'
import { ButtonGradient } from '@/src/components/pureStyledComponents/buttons/Button'
import { TabContent } from '@/src/components/tabs/Tabs'
import { ZERO_ADDRESS, ZERO_BN } from '@/src/constants/misc'
import useERC20Call from '@/src/hooks/contracts/useERC20Call'
import useERC20Transaction from '@/src/hooks/contracts/useERC20Transaction'
import useStakingRewardsTransaction from '@/src/hooks/contracts/useStakingRewardsTransaction'
import { StakingEnum, useStakingRewards } from '@/src/providers/stakingRewardsProvider'
import { GasOptions, useTransactionModal } from '@/src/providers/transactionModalProvider'
import { useWeb3Connection } from '@/src/providers/web3ConnectionProvider'
import { formatToken } from '@/src/web3/bigNumber'

const TokenInput = styled(BaseTokenInput)`
  margin: 0 auto 20px;
  max-width: 230px;
`

const ButtonsWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin: 0 auto;
`

const Button = styled(ButtonGradient)`
  min-width: 160px;
`

interface StakeTabContentProps {
  rewards: {
    decimals: number
    symbol: string
    tokenBalance: BigNumber
    userStake: BigNumber
  }
  stakeType: StakingEnum
  stakingAddress: string
  tabType: typeof DEPOSIT_TYPE | typeof WITHDRAW_TYPE
  tokenAddress: string
}

const StakeTabContent: FC<StakeTabContentProps> = ({
  rewards,
  stakeType,
  stakingAddress,
  tabType,
  tokenAddress,
}) => {
  const [inputError, setInputError] = useState('')
  const [tokenInputValue, setTokenInputValue] = useState('')

  const { address, appChainId, isAppConnected } = useWeb3Connection()

  const { handleAfterDeposit, handleAfterWithdraw } = useStakingRewards()

  const { isSubmitting, setConfigAndOpenModal } = useTransactionModal()

  const [tokenAllowance, refetchTokenAllowance] = useERC20Call(
    appChainId,
    tokenAddress,
    'allowance',
    [address || ZERO_ADDRESS, stakingAddress],
  )

  const { estimate: estimateApprove, execute: executeApprove } = useERC20Transaction(
    tokenAddress,
    'approve',
  )

  const { estimate: estimateStake, execute: executeStake } = useStakingRewardsTransaction(
    stakingAddress,
    'stake',
  )

  const { estimate: estimateWithdraw, execute: executeWithdraw } = useStakingRewardsTransaction(
    stakingAddress,
    'withdraw',
  )

  const { decimals, symbol, tokenBalance, userStake } = rewards

  const totalBalance = useMemo(() => {
    if (tabType === DEPOSIT_TYPE) {
      return tokenBalance || ZERO_BN
    }
    if (tabType === WITHDRAW_TYPE) {
      return userStake || ZERO_BN
    }

    throw new Error('Unknown action type')
  }, [tabType, tokenBalance, userStake])

  const hasAllowance = (tokenAllowance as BigNumber).gt(ZERO_BN)

  useEffect(() => {
    if (tokenInputValue && BigNumber.from(tokenInputValue).gt(MaxUint256)) {
      setInputError('Amount is too big')
      return
    }

    if (tokenInputValue && BigNumber.from(tokenInputValue).gt(totalBalance)) {
      setInputError('Insufficient balance')
      return
    }

    setInputError('')
  }, [totalBalance, tokenInputValue])

  const handleApprove = async () => {
    setConfigAndOpenModal({
      onConfirm: async (txGasOptions: GasOptions) => {
        const receipt = await executeApprove([stakingAddress, MaxUint256], txGasOptions)
        if (receipt) {
          refetchTokenAllowance()
        }
      },
      title: `Approve ${symbol}`,
      estimate: () => estimateApprove([stakingAddress, MaxUint256]),
    })
  }

  const handleDeposit = async () => {
    setConfigAndOpenModal({
      onConfirm: async (txGasOptions: GasOptions) => {
        const receipt = await executeStake([tokenInputValue], txGasOptions)
        if (receipt) {
          handleAfterDeposit(stakeType, BigNumber.from(tokenInputValue))
          setTokenInputValue('')
          setInputError('')
        }
      },
      title: `Stake ${symbol}`,
      estimate: () => estimateStake([tokenInputValue]),
    })
  }

  const handleWithdraw = async () => {
    setConfigAndOpenModal({
      onConfirm: async (txGasOptions: GasOptions) => {
        const receipt = await executeWithdraw([tokenInputValue], txGasOptions)
        if (receipt) {
          handleAfterWithdraw(stakeType, BigNumber.from(tokenInputValue))
          setTokenInputValue('')
          setInputError('')
        }
      },
      title: `Withdraw ${symbol}`,
      estimate: () => estimateWithdraw([tokenInputValue]),
    })
  }

  return (
    <TabContent>
      <TokenInput
        decimals={decimals}
        error={inputError}
        maxValue={totalBalance.toString()}
        maxValueFormatted={formatToken(totalBalance, decimals) || ''}
        setValue={setTokenInputValue}
        symbol={symbol}
        value={tokenInputValue}
      />
      <ButtonsWrapper>
        <Button
          disabled={!address || !isAppConnected || hasAllowance || isSubmitting}
          onClick={handleApprove}
        >
          Approve
        </Button>
        <Button
          disabled={
            !address ||
            !isAppConnected ||
            !tokenInputValue ||
            Boolean(inputError) ||
            !hasAllowance ||
            isSubmitting
          }
          onClick={tabType === DEPOSIT_TYPE ? handleDeposit : handleWithdraw}
        >
          {tabType === DEPOSIT_TYPE ? 'Deposit' : 'Withdraw'}
        </Button>
      </ButtonsWrapper>
    </TabContent>
  )
}

export default StakeTabContent
