import { useState } from 'react'
import styled from 'styled-components'

import { GradientButton } from '@/src/components/pureStyledComponents/buttons/Button'
import { MAX_BN } from '@/src/constants/misc'
import { ParsedAelinPool } from '@/src/hooks/aelin/useAelinPool'
import useERC20Transaction from '@/src/hooks/contracts/useERC20Transaction'
import { useWeb3Connection } from '@/src/providers/web3ConnectionProvider'

const Title = styled.h4`
  color: ${({ theme }) => theme.colors.textColor};
  font-family: ${({ theme }) => theme.fonts.fontFamilyTitle};
  font-size: 1.8rem;
  font-weight: 600;
  line-height: 1.4;
  margin: 0 0 20px;
  text-align: left;
  width: 100%;
`

const Description = styled.p`
  color: ${({ theme }) => theme.colors.textColorLight};
  display: flex;
  font-size: 1.4rem;
  font-weight: 400;
  line-height: 1.5;
  margin: 0 0 40px;
  text-align: left;
  text-decoration: none;
  width: 100%;
`

type Props = {
  pool: ParsedAelinPool
  refetchAllowance: () => void
}
export default function ApprovePool({ pool, refetchAllowance }: Props) {
  const { address: poolAddress, investmentToken, investmentTokenSymbol } = pool
  const { address, isAppConnected } = useWeb3Connection()
  const [isLoading, setIsLoading] = useState(false)

  const approve = useERC20Transaction(investmentToken, 'approve')

  const approveInvestmentToken = async () => {
    setIsLoading(true)
    try {
      await approve(poolAddress, MAX_BN)
      refetchAllowance()
      setIsLoading(false)
    } catch (error) {
      setIsLoading(false)
    }
  }

  return (
    <>
      <Title>Deposit tokens</Title>
      <Description>
        Before you deposit, the pool needs your permission to transfer your {investmentTokenSymbol}
      </Description>
      <GradientButton
        disabled={!address || !isAppConnected || isLoading}
        onClick={approveInvestmentToken}
      >
        Approve
      </GradientButton>
    </>
  )
}
