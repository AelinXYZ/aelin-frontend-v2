import { useRouter } from 'next/router'

import InfiniteScroll from 'react-infinite-scroll-component'

import { genericSuspense } from '@/src/components/helpers/SafeSuspense'
import { ButtonPrimaryLightSm } from '@/src/components/pureStyledComponents/buttons/Button'
import { BaseCard } from '@/src/components/pureStyledComponents/common/BaseCard'
import { Cell, Row, Table, TableWrapper } from '@/src/components/pureStyledComponents/common/Table'
import { Chains, getKeyChainByValue } from '@/src/constants/chains'

export const List: React.FC = ({ ...restProps }) => {
  const router = useRouter()
  const columns = {
    alignment: {
      seePool: 'right',
    },
    widths: '140px 1fr 120px',
  }

  const data = [
    {
      date: 'Dec 1, 2021 10:00AM',
      message: 'Welcome to Aelin! Interested in learning some of the basics? Head to our docs.',
      network: Chains.kovan,
      link: { href: 'https://docs.aelin.xyz/', title: 'Learn more' },
    },
    {
      date: 'Jan 1, 2022 10:00AM',
      message:
        "You've been whitelisted to the Nukevaults.com private pool. Private pools are closed to a select group of investors.",
      network: Chains.kovan,
      id: '0xf68a28f3674972fe6e0b5bc6677a6c47ea1ce6e5',
    },
    {
      date: 'Feb 1, 2022 10:00AM',
      message:
        'A deal has been proposed in the Nukevaults.com pool. If you do not accept, it will be treated as declining the deal.',
      network: Chains.kovan,
      id: '0xf68a28f3674972fe6e0b5bc6677a6c47ea1ce6e5',
    },
    {
      date: 'Mar 1, 2022 11:00AM',
      message: "You're eligible for a second round of investing in the Nukevaults.com pool.",
      network: Chains.kovan,
      id: '0xf68a28f3674972fe6e0b5bc6677a6c47ea1ce6e5',
    },
    {
      date: 'Apr 1, 2022 01:00PM',
      message: 'The vesting cliff countdown has begun in the Nukevaults.com pool.',
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
          {!data.length ? (
            <BaseCard>No data.</BaseCard>
          ) : (
            data.map((item, index) => {
              const { date, id, link, message, network } = item
              return (
                <Row
                  columns={columns.widths}
                  hasHover
                  key={index}
                  onClick={() => {
                    if (link) {
                      window.open(link.href, '_blank')
                    } else {
                      router.push(`/pool/${getKeyChainByValue(network)}/${id}`)
                    }
                  }}
                >
                  <Cell>{date}</Cell>
                  <Cell light>{message}</Cell>
                  <Cell justifyContent={columns.alignment.seePool}>
                    {link ? (
                      <ButtonPrimaryLightSm as="a" href={link.href} target="_blank">
                        {link.title}
                      </ButtonPrimaryLightSm>
                    ) : (
                      <ButtonPrimaryLightSm
                        onClick={() => {
                          router.push(`/pool/${getKeyChainByValue(network)}/${id}`)
                        }}
                      >
                        Go to pool
                      </ButtonPrimaryLightSm>
                    )}
                  </Cell>
                </Row>
              )
            })
          )}
        </InfiniteScroll>
      </Table>
    </TableWrapper>
  )
}

export default genericSuspense(List)
