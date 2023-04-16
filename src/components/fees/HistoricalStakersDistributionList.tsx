import { useMemo } from 'react'
import styled from 'styled-components'

import { getAddress } from '@ethersproject/address'

import OptimismDealTokenDistribution from '@/public/data/optimism-deal-token-distribution.json'
import { ButtonPrimaryLight } from '@/src/components/pureStyledComponents/buttons/Button'
import { Cell, Row, TableBody, TableHead } from '@/src/components/pureStyledComponents/common/Table'
import { SortableTH } from '@/src/components/table/SortableTH'
import { Chains } from '@/src/constants/chains'
import { useWeb3Connection } from '@/src/providers/web3ConnectionProvider'

const InfoContainer = styled.div`
  align-items: center;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 20px;
  margin-top: 18px;
`

const Text = styled.span`
  font-size: 0.8rem;
  font-weight: 400;
  line-height: 1.2;
  color: ${({ theme: { colors } }) => colors.textColor};
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
      {(appChainId !== Chains.optimism || userAllocation === undefined) && (
        <InfoContainer>
          {appChainId !== Chains.optimism && (
            <Text>Fees can only be claimed on Optimism network</Text>
          )}
          {appChainId !== Chains.optimism && appChainId !== Chains.goerli && (
            <ButtonPrimaryLight onClick={() => pushNetwork(Chains.optimism)}>
              Switch to Optimism
            </ButtonPrimaryLight>
          )}
          {appChainId === Chains.optimism && userAllocation === undefined && (
            <Text>This address isn’t eligible for the historical stakers fee distribution</Text>
          )}
        </InfoContainer>
      )}
      {appChainId === Chains.optimism && userAllocation !== undefined && (
        <>
          <TableHead columns={columns.widths}>
            {tableHeaderCells.map(({ title }, index) => (
              <SortableTH key={index}>{title}</SortableTH>
            ))}
          </TableHead>
          <TableBody>
            {data.map((item) => {
              const { tokenName, totalAmount } = item

              console.log('xxx allocated', Number(userAllocation) * totalAmount)

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
                    }).format(Number(userAllocation) * totalAmount)}
                  </Cell>
                  <Cell mobileJustifyContent="center">Will be claimable soon</Cell>
                </Row>
              )
            })}
          </TableBody>
        </>
      )}
    </>
  )
}

export default HistoricalStakersDistributionList
