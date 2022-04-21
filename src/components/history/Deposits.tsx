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

export const Deposits: React.FC = ({ ...restProps }) => {
  const router = useRouter()
  const columns = {
    alignment: {
      network: 'center',
      seePool: 'right',
    },
    widths: '140px 140px 120px 180px 120px 1fr',
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
      title: 'Sponsor',
      sortKey: '',
    },
    {
      title: 'Amount deposited',
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
      amountDeposited: '1,000,000 USDC',
      date: 'Dec 1, 2021 10:00AM',
      id: '0xf68a28f3674972fe6e0b5bc6677a6c47ea1ce6e5',
      network: Chains.kovan,
      poolName: 'Nuvevaults.com',
      sponsor: 'Nukevault',
    },
    {
      amountDeposited: '1,000,000 USDC',
      date: 'Dec 1, 2021 10:00AM',
      id: '0xf68a28f3674972fe6e0b5bc6677a6c47ea1ce6e5',
      network: Chains.kovan,
      poolName: 'Nuvevaults.com',
      sponsor: 'Nukevault',
    },
    {
      amountDeposited: '1,000,000 USDC',
      date: 'Dec 1, 2021 10:00AM',
      id: '0xf68a28f3674972fe6e0b5bc6677a6c47ea1ce6e5',
      network: Chains.kovan,
      poolName: 'Nuvevaults.com',
      sponsor: 'Nukevault',
    },
    {
      amountDeposited: '1,000,000 USDC',
      date: 'Dec 1, 2021 10:00AM',
      id: '0xf68a28f3674972fe6e0b5bc6677a6c47ea1ce6e5',
      network: Chains.kovan,
      poolName: 'Nuvevaults.com',
      sponsor: 'Nukevault',
    },
    {
      amountDeposited: '1,000,000 USDC',
      date: 'Dec 1, 2021 10:00AM',
      id: '0xf68a28f3674972fe6e0b5bc6677a6c47ea1ce6e5',
      network: Chains.kovan,
      poolName: 'Nuvevaults.com',
      sponsor: 'Nukevault',
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
            data.map((item) => {
              const { amountDeposited, date, id, network, poolName, sponsor } = item
              return (
                <Row
                  columns={columns.widths}
                  hasHover
                  key={id}
                  onClick={() => {
                    router.push(`/pool/${getKeyChainByValue(network)}/${id}`)
                  }}
                >
                  <Cell>{date}</Cell>
                  <Cell light>{poolName}</Cell>
                  <Cell light>{sponsor}</Cell>
                  <Cell light>{amountDeposited}</Cell>
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

export default genericSuspense(Deposits)
