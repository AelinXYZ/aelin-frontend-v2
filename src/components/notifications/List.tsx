import { useRouter } from 'next/router'
import styled from 'styled-components'

import InfiniteScroll from 'react-infinite-scroll-component'

import { genericSuspense } from '@/src/components/helpers/SafeSuspense'
import {
  ButtonPrimaryLight,
  ButtonPrimaryLightSm,
} from '@/src/components/pureStyledComponents/buttons/Button'
import { ButtonRemove as BaseButtonRemove } from '@/src/components/pureStyledComponents/buttons/ButtonCircle'
import { BaseCard } from '@/src/components/pureStyledComponents/common/BaseCard'
import {
  Cell,
  LinkCell,
  Row,
  Table,
  TableWrapper,
} from '@/src/components/pureStyledComponents/common/Table'
import { getKeyChainByValue } from '@/src/constants/chains'
import { ClearedNotifications } from '@/src/hooks/aelin/useAelinNotifications'
import { useNotifications } from '@/src/providers/notificationsProvider'
import { DATE_DETAILED, formatDate } from '@/src/utils/date'

const ButtonClear = styled(ButtonPrimaryLight)`
  margin: 20px auto 0;
`

const ButtonRemove = styled(BaseButtonRemove)`
  --dimensions: 24px;

  background-size: 12px;
  height: var(--dimensions);
  width: var(--dimensions);
`

export const List: React.FC = ({ ...restProps }) => {
  const router = useRouter()
  const {
    clearedNotifications,
    errorNotification,
    hasMore,
    nextPage,
    notifications,
    setClearedNotifications,
  } = useNotifications()

  if (errorNotification) {
    throw errorNotification
  }

  const columns = {
    alignment: {
      seePool: 'right',
    },
    widths: '140px 1fr 120px',
  }

  const handleClearSingleNotification = (id: string) =>
    setClearedNotifications((prevNotifications) => ({
      ...prevNotifications,
      [id]: true,
    }))

  const handleClearAllNotifications = () =>
    setClearedNotifications(
      notifications.reduce((resultAcc: ClearedNotifications, { id }) => {
        return {
          ...resultAcc,
          [id]: true,
        }
      }, clearedNotifications),
    )

  return (
    <TableWrapper {...restProps}>
      <Table>
        <InfiniteScroll
          dataLength={notifications.length}
          hasMore={hasMore}
          loader={
            <Row columns={'1fr'}>
              <Cell justifyContent="center">Loading...</Cell>
            </Row>
          }
          next={nextPage}
        >
          {!notifications?.length ? (
            <BaseCard>No data.</BaseCard>
          ) : (
            notifications.map((item, index) => {
              const { chainId, id, message, poolAddress, triggerStart, type } = item
              return (
                <Row
                  columns={columns.widths}
                  hasHover
                  key={index}
                  onClick={(e) => {
                    e.stopPropagation()
                    router.push(
                      `/pool/${getKeyChainByValue(chainId)}/${poolAddress}?notification=${type}`,
                    )
                  }}
                >
                  <Cell>{formatDate(triggerStart, DATE_DETAILED)}</Cell>
                  <Cell light>{message}</Cell>
                  <LinkCell justifyContent={columns.alignment.seePool}>
                    <ButtonPrimaryLightSm
                      onClick={(e) => {
                        e.stopPropagation()
                        router.push(
                          `/pool/${getKeyChainByValue(
                            chainId,
                          )}/${poolAddress}?notification=${type}`,
                        )
                      }}
                    >
                      Go to pool
                    </ButtonPrimaryLightSm>
                    <ButtonRemove
                      onClick={(e) => {
                        e.stopPropagation()
                        handleClearSingleNotification(id)
                      }}
                    />
                  </LinkCell>
                </Row>
              )
            })
          )}
        </InfiniteScroll>
      </Table>
      {!!notifications?.length && (
        <ButtonClear onClick={handleClearAllNotifications}>Clear All</ButtonClear>
      )}
    </TableWrapper>
  )
}

export default genericSuspense(List)
