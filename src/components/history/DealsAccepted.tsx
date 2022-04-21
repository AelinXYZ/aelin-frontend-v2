import { useRouter } from 'next/router'

import InfiniteScroll from 'react-infinite-scroll-component'

import { genericSuspense } from '@/src/components/helpers/SafeSuspense'
import { ButtonPrimaryLightSm } from '@/src/components/pureStyledComponents/buttons/Button'
import { BaseCard } from '@/src/components/pureStyledComponents/common/BaseCard'
import {
  Cell,
  LinkCell,
  Row,
  Table,
  TableHead,
  TableWrapper,
} from '@/src/components/pureStyledComponents/common/Table'
import { ExternalLink } from '@/src/components/table/ExternalLink'
import { SortableTH } from '@/src/components/table/SortableTH'
import { Chains, getKeyChainByValue, getNetworkConfig } from '@/src/constants/chains'

export const DealsAccepted: React.FC = ({ ...restProps }) => {
  const router = useRouter()
  const columns = {
    alignment: {
      network: 'center',
      seePool: 'right',
    },
    widths: '140px 140px 170px 150px 120px 1fr',
  }

  const tableHeaderCells = [
    {
      title: 'Date',
      sortKey: 'date',
    },
    {
      title: 'Pool Name',
      sortKey: '',
    },
    {
      title: 'Investment Amount',
      sortKey: '',
    },
    {
      title: 'Deal token amount',
      sortKey: '',
    },
    {
      title: 'Network',
      sortKey: '',
      justifyContent: columns.alignment.network,
    },
    {
      title: '',
      sortKey: '',
      justifyContent: columns.alignment.seePool,
    },
  ]

  const handleSort = (sortBy: string) => {
    console.log(sortBy)
  }

  const sortBy = 'date'

  const data = [
    {
      date: 'Dec 1, 2021 10:00AM',
      poolName: 'Nuvevaults.com',
      investmentAmount: '1,000,000 USDC',
      dealTokenAmount: '500,000 vNUKE',
      network: Chains.kovan,
      id: '0xf68a28f3674972fe6e0b5bc6677a6c47ea1ce6e5',
    },
    {
      date: 'Dec 1, 2021 10:00AM',
      poolName: 'Nuvevaults.com',
      investmentAmount: '1,000,000 USDC',
      dealTokenAmount: '500,000 vNUKE',
      network: Chains.kovan,
      id: '0xf68a28f3674972fe6e0b5bc6677a6c47ea1ce6e5',
    },
    {
      date: 'Dec 1, 2021 10:00AM',
      poolName: 'Nuvevaults.com',
      investmentAmount: '1,000,000 USDC',
      dealTokenAmount: '500,000 vNUKE',
      network: Chains.kovan,
      id: '0xf68a28f3674972fe6e0b5bc6677a6c47ea1ce6e5',
    },
    {
      date: 'Dec 1, 2021 10:00AM',
      poolName: 'Nuvevaults.com',
      investmentAmount: '1,000,000 USDC',
      dealTokenAmount: '500,000 vNUKE',
      network: Chains.kovan,
      id: '0xf68a28f3674972fe6e0b5bc6677a6c47ea1ce6e5',
    },
    {
      date: 'Dec 1, 2021 10:00AM',
      poolName: 'Nuvevaults.com',
      investmentAmount: '1,000,000 USDC',
      dealTokenAmount: '500,000 vNUKE',
      network: Chains.kovan,
      id: '0xf68a28f3674972fe6e0b5bc6677a6c47ea1ce6e5',
    },
    {
      date: 'Dec 1, 2021 10:00AM',
      poolName: 'Nuvevaults.com',
      investmentAmount: '1,000,000 USDC',
      dealTokenAmount: '500,000 vNUKE',
      network: Chains.kovan,
      id: '0xf68a28f3674972fe6e0b5bc6677a6c47ea1ce6e5',
    },
    {
      date: 'Dec 1, 2021 10:00AM',
      poolName: 'Nuvevaults.com',
      investmentAmount: '1,000,000 USDC',
      dealTokenAmount: '500,000 vNUKE',
      network: Chains.kovan,
      id: '0xf68a28f3674972fe6e0b5bc6677a6c47ea1ce6e5',
    },
    {
      date: 'Dec 1, 2021 10:00AM',
      poolName: 'Nuvevaults.com',
      investmentAmount: '1,000,000 USDC',
      dealTokenAmount: '500,000 vNUKE',
      network: Chains.kovan,
      id: '0xf68a28f3674972fe6e0b5bc6677a6c47ea1ce6e5',
    },
  ]

  return (
    <TableWrapper {...restProps}>
      <Table>
        <InfiniteScroll
          dataLength={data.length}
          hasMore={false}
          loader={
            <Row columns={'1fr'}>
              <Cell justifyContent="center">Loading...</Cell>
            </Row>
          }
          next={() => console.log('next')}
        >
          <TableHead columns={columns.widths}>
            {tableHeaderCells.map(({ justifyContent, sortKey, title }, index) => (
              <SortableTH
                isActive={sortBy === sortKey}
                justifyContent={justifyContent}
                key={index}
                onClick={() => {
                  handleSort(sortKey)
                }}
              >
                {title}
              </SortableTH>
            ))}
          </TableHead>
          {!data.length ? (
            <BaseCard>No data.</BaseCard>
          ) : (
            data.map((item, index) => {
              const { date, dealTokenAmount, id, investmentAmount, network, poolName } = item
              return (
                <Row
                  columns={columns.widths}
                  hasHover
                  key={index}
                  onClick={() => {
                    router.push(`/pool/${getKeyChainByValue(network)}/${id}`)
                  }}
                >
                  <Cell>{date}</Cell>
                  <Cell light>{poolName}</Cell>
                  <Cell light>{investmentAmount}</Cell>
                  <Cell light>{dealTokenAmount}</Cell>
                  <Cell justifyContent={columns.alignment.network} light>
                    {getNetworkConfig(network).icon}
                  </Cell>
                  <LinkCell justifyContent={columns.alignment.seePool} light>
                    <ButtonPrimaryLightSm
                      onClick={() => {
                        router.push(`/pool/${getKeyChainByValue(network)}/${id}`)
                      }}
                    >
                      See Pool
                    </ButtonPrimaryLightSm>
                    <ExternalLink href={`https://etherscan.io/address/${id}`} />
                  </LinkCell>
                </Row>
              )
            })
          )}
        </InfiniteScroll>
      </Table>
    </TableWrapper>
  )
}

export default genericSuspense(DealsAccepted)
