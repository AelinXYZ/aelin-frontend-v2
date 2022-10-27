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
  Row as BaseRow,
  TableBody as BaseTableBody,
  Cell,
  LinkCell,
  LoadingTableRow,
} from '@/src/components/pureStyledComponents/common/Table'
import { getKeyChainByValue } from '@/src/constants/chains'
import { ClearedNotifications } from '@/src/hooks/aelin/useAelinNotifications'
import { useNotifications } from '@/src/providers/notificationsProvider'
import { useThemeContext } from '@/src/providers/themeContextProvider'
import { DATE_DETAILED, formatDate } from '@/src/utils/date'

const TableBody = styled(BaseTableBody)`
  grid-template-columns: 1fr;
`

const Row = styled(BaseRow)`
  align-items: flex-start;
  display: flex;
  flex-wrap: wrap;

  @media (min-width: ${({ theme }) => theme.themeBreakPoints.tabletDesktopStart}) {
    display: grid;
  }

  .cellTitle {
    width: 100%;
  }

  .cellText {
    width: calc(100% - 120px);
  }

  .cellLink {
    margin-left: auto;
    width: fit-content;
  }

  @media (min-width: ${({ theme }) => theme.themeBreakPoints.tabletDesktopStart}) {
    .cellTitle,
    .cellText,
    .cellLink {
      width: auto;
    }

    .cellLink {
      margin-left: 0;
    }
  }
`

const ButtonClear = styled(ButtonPrimaryLight)`
  margin: 20px auto 0;
`

const ButtonRemove = styled(BaseButtonRemove)`
  --dimensions: 24px;

  background-size: 12px;
  height: var(--dimensions);
  width: var(--dimensions);
`

export const List: React.FC = () => {
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

  const { currentThemeName } = useThemeContext()

  return (
    <>
      <InfiniteScroll
        dataLength={notifications.length}
        hasMore={hasMore}
        loader={<LoadingTableRow />}
        next={nextPage}
      >
        {!notifications?.length ? (
          <BaseCard>No notifications to show.</BaseCard>
        ) : (
          <TableBody>
            {notifications.map((item, index) => {
              const { chainId, id, message, poolAddress, triggerStart, type } = item

              return (
                <Row columns={columns.widths} key={index}>
                  <Cell className="cellTitle">{formatDate(triggerStart, DATE_DETAILED)}</Cell>
                  <Cell className="cellText" light>
                    {message}
                  </Cell>
                  <LinkCell className="cellLink" justifyContent={columns.alignment.seePool}>
                    <ButtonPrimaryLightSm
                      onClick={(e) => {
                        e.preventDefault()
                        e.stopPropagation()
                        handleClearSingleNotification(id)
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
                      currentThemeName={currentThemeName}
                      onClick={(e) => {
                        e.preventDefault()
                        e.stopPropagation()
                        handleClearSingleNotification(id)
                      }}
                    />
                  </LinkCell>
                </Row>
              )
            })}
          </TableBody>
        )}
      </InfiniteScroll>
      {!!notifications?.length && (
        <ButtonClear onClick={handleClearAllNotifications}>Clear All</ButtonClear>
      )}
    </>
  )
}

export default genericSuspense(List)
