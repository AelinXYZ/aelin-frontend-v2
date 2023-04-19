import { useMemo } from 'react'
import styled from 'styled-components'

import { getAddress } from '@ethersproject/address'

import OptimismDealTokenDistribution from '@/public/data/optimism-deal-token-distribution.json'
import {
  ButtonGradient,
  ButtonPrimaryLight,
} from '@/src/components/pureStyledComponents/buttons/Button'
import { Cell, Row, TableBody, TableHead } from '@/src/components/pureStyledComponents/common/Table'
import { SortableTH } from '@/src/components/table/SortableTH'
import { Chains } from '@/src/constants/chains'
import { useWeb3Connection } from '@/src/providers/web3ConnectionProvider'

const InfoContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 20px;
  margin-top: 18px;
`

const Text = styled.span`
  font-size: 0.9rem;
  font-weight: 400;
  line-height: 1.2;
  color: ${({ theme: { colors } }) => colors.textColor};
`

const ClaimButtonContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 20px;
`

const ClaimButton = styled(ButtonGradient)`
  min-width: 140px;
`

const columns = {
  widths: '160px 160px 1fr 160px',
}

const tableHeaderCells = [
  {
    title: 'Deal token',
  },
  {
    title: 'Total amount',
  },
  {
    title: 'Allocated',
  },
  {
    title: 'Status',
  },
]

const data = [
  { tokenName: 'vSEY', totalAmount: 7519488.153057938 },
  { tokenName: 'vKWENTA', totalAmount: 313.37299999999999 },
  { tokenName: 'vHECO', totalAmount: 2047.43007028 },
  { tokenName: 'AELIN', totalAmount: 16.846242936861671 },
]

const HistoricalStakersDistributionList: React.FC = () => {
  const { address: userAddress, appChainId, pushNetwork } = useWeb3Connection()

  const userAllocation = useMemo(
    () =>
      OptimismDealTokenDistribution.find((item) => getAddress(item.address) === userAddress)
        ?.allocation,
    [userAddress],
  )

  return (
    <>
      {appChainId !== Chains.optimism && (
        <InfoContainer>
          {<Text>Fees can only be claimed on Optimism network</Text>}
          {appChainId !== Chains.goerli && (
            <ButtonPrimaryLight onClick={() => pushNetwork(Chains.optimism)}>
              Switch to Optimism
            </ButtonPrimaryLight>
          )}
        </InfoContainer>
      )}
      {appChainId === Chains.optimism && (
        <>
          <TableHead columns={columns.widths}>
            {tableHeaderCells.map(({ title }, index) => (
              <SortableTH key={index}>{title}</SortableTH>
            ))}
          </TableHead>
          <TableBody>
            {data.map((item) => {
              const { tokenName, totalAmount } = item
              return (
                <Row columns={columns.widths} key={tokenName}>
                  <Cell mobileJustifyContent="center">{tokenName}</Cell>
                  <Cell mobileJustifyContent="center">
                    {Intl.NumberFormat('en', {
                      maximumFractionDigits: 2,
                    }).format(totalAmount)}
                  </Cell>
                  <Cell mobileJustifyContent="center">
                    {Intl.NumberFormat('en', {
                      maximumFractionDigits: 18,
                    }).format(Number(userAllocation ?? 0) * totalAmount)}
                  </Cell>
                  <Cell mobileJustifyContent="center">
                    {userAllocation === undefined ? 'Not eligible' : 'Claimable soon'}
                  </Cell>
                </Row>
              )
            })}
          </TableBody>
          <ClaimButtonContainer>
            <ClaimButton disabled={true}>Claim</ClaimButton>
          </ClaimButtonContainer>
        </>
      )}
    </>
  )
}

export default HistoricalStakersDistributionList
