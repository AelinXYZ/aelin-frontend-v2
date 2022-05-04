import { useRouter } from 'next/router'

import InfiniteScroll from 'react-infinite-scroll-component'

import { genericSuspense } from '@/src/components/helpers/SafeSuspense'
import { ButtonPrimaryLightSm } from '@/src/components/pureStyledComponents/buttons/Button'
import { BaseCard } from '@/src/components/pureStyledComponents/common/BaseCard'
import { Cell, Row, Table, TableWrapper } from '@/src/components/pureStyledComponents/common/Table'
import { getKeyChainByValue } from '@/src/constants/chains'
import useAelinNotifications, { ParsedNotification } from '@/src/hooks/aelin/useAelinNotifications'
import useLocalStorage from '@/src/hooks/localStorage/useLocalStorage'
import { DATE_DETAILED, formatDate } from '@/src/utils/date'

type ClearedNotifications = {
  [key: string]: boolean | undefined
}

export const List: React.FC = ({ ...restProps }) => {
  const router = useRouter()
  const [clearedNotifications, setClearedNotifications] = useLocalStorage<ClearedNotifications>(
    'aelin-cleared-notifications',
    {},
  )
  const {
    data,
    error: errorNotification,
    hasMore,
    nextPage,
  } = useAelinNotifications(clearedNotifications)

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
      data.reduce((resultAcc: ClearedNotifications, { id }) => {
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
          dataLength={data.length}
          hasMore={hasMore}
          loader={
            <Row columns={'1fr'}>
              <Cell justifyContent="center">Loading...</Cell>
            </Row>
          }
          next={nextPage}
        >
          {!data?.length ? (
            <BaseCard>No data.</BaseCard>
          ) : (
            data.map((item, index) => {
              const { chainId, id, message, poolAddress, triggerStart } = item
              return (
                <Row
                  columns={columns.widths}
                  hasHover
                  key={index}
                  onClick={() => {
                    router.push(`/pool/${getKeyChainByValue(chainId)}/${poolAddress}`)
                  }}
                >
                  <Cell>{formatDate(triggerStart, DATE_DETAILED)}</Cell>
                  <Cell light>{message}</Cell>
                  <Cell justifyContent={columns.alignment.seePool}>
                    <ButtonPrimaryLightSm
                      onClick={() => {
                        router.push(`/pool/${getKeyChainByValue(chainId)}/${poolAddress}`)
                      }}
                    >
                      Go to pool
                    </ButtonPrimaryLightSm>
                    <ButtonPrimaryLightSm onClick={() => handleClearSingleNotification(id)}>
                      Clear
                    </ButtonPrimaryLightSm>
                  </Cell>
                </Row>
              )
            })
          )}
        </InfiniteScroll>
      </Table>
      <ButtonPrimaryLightSm onClick={handleClearAllNotifications}>Clear All</ButtonPrimaryLightSm>
    </TableWrapper>
  )
}

export default genericSuspense(List)
