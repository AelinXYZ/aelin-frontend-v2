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
import useAelinNotifications from '@/src/hooks/aelin/useAelinNotifications'
import useLocalStorage from '@/src/hooks/localStorage/useLocalStorage'
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
                  onClick={(e) => {
                    e.stopPropagation()
                    router.push(`/pool/${getKeyChainByValue(chainId)}/${poolAddress}`)
                  }}
                >
                  <Cell>{formatDate(triggerStart, DATE_DETAILED)}</Cell>
                  <Cell light>{message}</Cell>
                  <LinkCell justifyContent={columns.alignment.seePool}>
                    <ButtonPrimaryLightSm
                      onClick={(e) => {
                        e.stopPropagation()
                        router.push(`/pool/${getKeyChainByValue(chainId)}/${poolAddress}`)
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
      {!!data?.length && <ButtonClear onClick={handleClearAllNotifications}>Clear All</ButtonClear>}
    </TableWrapper>
  )
}

export default genericSuspense(List)
