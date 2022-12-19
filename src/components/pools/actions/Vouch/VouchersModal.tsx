import { useRouter } from 'next/router'
import { useState } from 'react'
import styled from 'styled-components'

import InfiniteScroll from 'react-infinite-scroll-component'

import { OrderDirection, User_OrderBy } from '@/graphql-schema'
import ENSOrAddress from '@/src/components/aelin/ENSOrAddress'
import { Spinner } from '@/src/components/assets/Spinner'
import {
  Modal as BaseModal,
  Card as ModalCard,
  Title as ModalTitle,
} from '@/src/components/common/Modal'
import { genericSuspense } from '@/src/components/helpers/SafeSuspense'
import {
  ButtonPrimaryLight,
  ButtonPrimaryLightSm,
} from '@/src/components/pureStyledComponents/buttons/Button'
import { BaseCard } from '@/src/components/pureStyledComponents/common/BaseCard'
import {
  LoadingTableRow as BaseLoadingTableRow,
  Row as BaseRow,
  TableBody as BaseTableBody,
  TableHead as BaseTableHead,
  Cell,
  HideOnDesktop,
  LinkCell,
} from '@/src/components/pureStyledComponents/common/Table'
import { SortableTH } from '@/src/components/table/SortableTH'
import { ChainsValues } from '@/src/constants/chains'
import { ParsedAelinPool } from '@/src/hooks/aelin/useAelinPool'
import useAelinUsers from '@/src/hooks/aelin/useAelinUsers'

type VouchersModalProps = {
  pool: ParsedAelinPool
  onClose: () => void
}

const Modal = styled(BaseModal)`
  & ${ModalCard} {
    padding: 20px 25px 0 25px;
  }

  & ${ModalTitle} {
    margin: 0 0 10px;
  }
`

const TableWrapper = styled(BaseCard)`
  margin-top: 20px;
  background-color: ${({ theme }) => theme.colors.gray};
  border: ${({ theme: { card } }) => `1px solid ${card.titleColor}`};
  padding: 0px;
  padding-left: 30px;
  padding-top: 4px;

  &:first-child ::-webkit-scrollbar {
    background-color: transparent;
    width: 0.5rem;
  }

  &:first-child ::-webkit-scrollbar-thumb {
    background-color: white;
    border-radius: 100vw;
  }

  &:first-child::-webkit-scrollbar-track {
    border-radius: 100vw;
    margin-block: 0.5em;
  }
`

const TableBody = styled(BaseTableBody)`
  row-gap: 0px;
`

const Row = styled(BaseRow)`
  background-color: ${({ theme }) => theme.colors.gray};
  border: none;
  border-radius: 0px;
  border-bottom: ${({ theme }) => theme.card.borderColor};
  padding-left: 0;
  padding-right: 0px;
  margin-right: 30px;

  &:last-child {
    border: none;
  }

  @media (max-width: ${({ theme }) => theme.themeBreakPoints.tabletLandscapeStart}) {
    border: none;
  }
`

const TableHead = styled(BaseTableHead)`
  background-color: ${({ theme }) => theme.colors.gray};
  padding-left: 0;
  padding-top: 25px;
  margin-bottom: 0px;
`

const LoadingWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 400px;
  min-width: 700px;
`

const CloseButton = styled(ButtonPrimaryLight)`
  margin: 20px 0;
  width: 20%;
`

const LoadingTableRow = styled(BaseLoadingTableRow)`
  background-color: transparent;
  border: none;
  border-radius: 0px;
  padding-left: 0;
  padding-right: 0px;
  margin-right: 30px;
`

const columns = {
  alignment: {
    seeMore: 'right',
  },
  widths: '180px 1fr 120px',
}

const Loading = () => {
  return (
    <LoadingWrapper>
      <i>Loading</i>
      <Spinner />
    </LoadingWrapper>
  )
}

const VouchersTable = genericSuspense(
  ({ pool }: { pool: ParsedAelinPool }) => {
    const router = useRouter()
    const [orderDirection, setOrderDirection] = useState<OrderDirection>(OrderDirection.Desc)
    const { data, error, hasMore, nextPage } = useAelinUsers({
      orderBy: User_OrderBy.PoolsVouchedAmt,
      orderDirection,
      where: {
        poolsVouched_contains: [pool.address],
      },
    })

    const handleSort = () => {
      if (orderDirection === OrderDirection.Desc) return setOrderDirection(OrderDirection.Asc)
      setOrderDirection(OrderDirection.Desc)
    }

    const tableHeaderCells = [
      {
        title: 'Address',
      },
      {
        title: 'Pools Vouched',
        sortKey: User_OrderBy.PoolsVouchedAmt,
      },
    ]

    return (
      <TableWrapper>
        <InfiniteScroll
          dataLength={data?.length}
          hasMore={hasMore}
          height={400}
          loader={<LoadingTableRow />}
          next={nextPage}
        >
          <TableHead columns={columns.widths}>
            {tableHeaderCells.map(({ sortKey, title }, index) => (
              <SortableTH
                isActive={!!sortKey}
                key={index}
                onClick={
                  sortKey
                    ? () => {
                        handleSort()
                      }
                    : undefined
                }
              >
                {title}
              </SortableTH>
            ))}
          </TableHead>
          {!data?.length ? (
            <BaseCard>No vouchers.</BaseCard>
          ) : (
            <TableBody>
              {data.map((item, index) => {
                const { chainId: network, id, poolsVouchedAmt } = item

                return (
                  <Row columns={columns.widths} key={index}>
                    <Cell mobileJustifyContent="center">
                      <ENSOrAddress
                        address={id}
                        light
                        mobileJustifyContent="center"
                        network={network as ChainsValues}
                      />
                    </Cell>
                    <Cell mobileJustifyContent="center">
                      <HideOnDesktop>Pools Vouched:&nbsp;</HideOnDesktop>
                      {poolsVouchedAmt}
                    </Cell>
                    <LinkCell
                      justifyContent={columns.alignment.seeMore}
                      mobileJustifyContent="center"
                    >
                      <ButtonPrimaryLightSm
                        onClick={(e) => {
                          e.preventDefault()
                          e.stopPropagation()
                          router.push(`/?voucher=${id}`)
                        }}
                      >
                        See more
                      </ButtonPrimaryLightSm>
                    </LinkCell>
                  </Row>
                )
              })}
            </TableBody>
          )}
        </InfiniteScroll>
      </TableWrapper>
    )
  },
  () => <Loading />,
)

const VouchersModal: React.FC<VouchersModalProps> = ({ onClose, pool }) => {
  return (
    <Modal onClose={onClose} showCancelButton={false} size="700px" title="Vouchers">
      <VouchersTable pool={pool} />
      <CloseButton onClick={onClose}>Close</CloseButton>
    </Modal>
  )
}

export default VouchersModal
