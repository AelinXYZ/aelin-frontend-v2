import { FC, useEffect, useMemo, useState } from 'react'
import styled from 'styled-components'

import { BigNumber } from '@ethersproject/bignumber'
import { MaxUint256 } from '@ethersproject/constants'

import { DEPOSIT_TYPE, WITHDRAW_TYPE } from '../../constants/types'
import { TokenInput as BaseTokenInput } from '@/src/components/form/TokenInput'
import { GradientButton } from '@/src/components/pureStyledComponents/buttons/Button'
import { TabContent } from '@/src/components/tabs/Tabs'
import { ZERO_ADDRESS, ZERO_BN } from '@/src/constants/misc'
import useERC20Call from '@/src/hooks/contracts/useERC20Call'
import useERC20Transaction from '@/src/hooks/contracts/useERC20Transaction'
import useStakingRewardsCall from '@/src/hooks/contracts/useStakingRewardsCall'
import useStakingRewardsTransaction from '@/src/hooks/contracts/useStakingRewardsTransaction'
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

const Button = styled(GradientButton)`
  min-width: 160px;
`

interface StakeTabContentProps {
  type: typeof DEPOSIT_TYPE | typeof WITHDRAW_TYPE
  decimals: number
  stakingAddress: string
  symbol?: string
  tokenAddress: string
}

const StakeTabContent: FC<StakeTabContentProps> = ({
  decimals,
  stakingAddress,
  symbol,
  tokenAddress,
  type,
}) => {
  const [inputError, setInputError] = useState('')
  const [tokenInputValue, setTokenInputValue] = useState('')

  const { address, appChainId, isAppConnected } = useWeb3Connection()

  const { isSubmitting, setConfigAndOpenModal } = useTransactionModal()

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
          refetchAllowance()
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
          refetchAllowance()
          refetchBalanceOf()
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
          refetchAllowance()
          refetchBalanceOf()
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
        decimals={decimals ?? 18}
        error={inputError}
        maxValue={totalBalance?.toString() ?? '0'}
        maxValueFormatted={formatToken(totalBalance ?? ZERO_BN, decimals ?? 18) ?? '0'}
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
          onClick={type === DEPOSIT_TYPE ? handleDeposit : handleWithdraw}
        >
          {type === DEPOSIT_TYPE ? 'Deposit' : 'Withdraw'}
        </Button>
      </ButtonsWrapper>
    </TabContent>
  )
}

export default StakeTabContent
