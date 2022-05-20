import { useRouter } from 'next/router'
import { useState } from 'react'

import InfiniteScroll from 'react-infinite-scroll-component'

import { ENSOrAddress } from '@/src/components/aelin/ENSOrAddress'
import { genericSuspense } from '@/src/components/helpers/SafeSuspense'
import { ButtonPrimaryLightSm } from '@/src/components/pureStyledComponents/buttons/Button'
import { BaseCard } from '@/src/components/pureStyledComponents/common/BaseCard'
import {
  Cell,
  HideOnDesktop,
  LinkCell,
  LoadingTableRow,
  RowLink,
  TableBody,
  TableHead,
} from '@/src/components/pureStyledComponents/common/Table'
import { SortableTH } from '@/src/components/table/SortableTH'
import { ChainsValues } from '@/src/constants/chains'

export const List: React.FC = () => {
  const router = useRouter()
  const [sortBy, setSortBy] = useState<string | undefined>()

  const columns = {
    alignment: {
      seeMore: 'right',
    },
    widths: '180px 1fr 120px',
  }

  const tableHeaderCells = [
    {
      title: 'Sponsor',
      sortKey: 'sponsor',
    },
    {
      title: 'Deals created',
      sortKey: 'dealsCreated',
    },
  ]

  const mockedSponsors = [
    {
      sponsor: '0x32dea44d5C243990B0133f5D103C2A784aA6a29F',
      dealsCreated: '13',
      network: 42,
    },
    {
      sponsor: '0x8365EFb25D0822AaF15Ee1D314147B6a7831C403',
      dealsCreated: '2',
      network: 42,
    },
    {
      sponsor: '0x800231D131E7f523D805E03856B08fe8811aE533',
      dealsCreated: '5',
      network: 42,
    },
    {
      sponsor: '0xFcbE615dEf610E806BB64427574A2c5c1fB55510',
      dealsCreated: '1',
      network: 42,
    },
    {
      sponsor: '0xdb55afCfd038D51642fD67025D8A252C645A91a8',
      dealsCreated: '2',
      network: 42,
    },
    {
      sponsor: '0x5E4e65926BA27467555EB562121fac00D24E9dD2',
      dealsCreated: '4',
      network: 42,
    },
    {
      sponsor: '0x6887246668a3b87F54DeB3b94Ba47a6f63F32985',
      dealsCreated: '8',
      network: 42,
    },
  ]

  const handleSort = (sortKey: string) => {
    setSortBy(sortKey)
    console.log(`sorted by ${sortBy}`)
  }

  return (
    <InfiniteScroll
      dataLength={mockedSponsors.length}
      hasMore={false}
      loader={<LoadingTableRow />}
      next={() => console.log('load next page')}
    >
      <TableHead columns={columns.widths}>
        {tableHeaderCells.map(({ sortKey, title }, index) => (
          <SortableTH
            isActive={sortBy === sortKey}
            key={index}
            onClick={() => {
              handleSort(sortKey)
            }}
          >
            {title}
          </SortableTH>
        ))}
      </TableHead>
      {!mockedSponsors?.length ? (
        <BaseCard>No sponsors.</BaseCard>
      ) : (
        <TableBody>
          {mockedSponsors.map((item, index) => {
            const { dealsCreated, network, sponsor } = item

            return (
              <RowLink columns={columns.widths} href={`/`} key={index}>
                <ENSOrAddress
                  address={sponsor}
                  light
                  mobileJustifyContent="center"
                  network={network as ChainsValues}
                />
                <Cell mobileJustifyContent="center">
                  <HideOnDesktop>Deals created:&nbsp;</HideOnDesktop>
                  {dealsCreated}
                </Cell>
                <LinkCell justifyContent={columns.alignment.seeMore} mobileJustifyContent="center">
                  <ButtonPrimaryLightSm
                    onClick={(e) => {
                      e.stopPropagation()
                      router.push(`/`)
                    }}
                  >
                    See more
                  </ButtonPrimaryLightSm>
                </LinkCell>
              </RowLink>
            )
          })}
        </TableBody>
      )}
    </InfiniteScroll>
  )
}

export default genericSuspense(List)
