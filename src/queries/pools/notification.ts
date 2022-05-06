import gql from 'graphql-tag'

export const NOTIFICATIONS_QUERY_NAME = 'notifications'

export const NOTIFICATIONS = gql`
  query notifications(
    $skip: Int
    $first: Int
    $orderBy: Notification_orderBy
    $orderDirection: OrderDirection
    $where: Notification_filter
    $block: Block_height
  ) {
    notifications(
      skip: $skip
      first: $first
      orderBy: $orderBy
      orderDirection: $orderDirection
      where: $where
      block: $block
    ) {
      ...NotificationDetails
    }
  }
`
