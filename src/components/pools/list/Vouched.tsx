import styled from 'styled-components'

import { PoolCreated_OrderBy } from '@/graphql-schema'
import ENSOrAddress from '@/src/components/aelin/ENSOrAddress'
import { Lock } from '@/src/components/assets/Lock'
import { Verified } from '@/src/components/assets/Verified'
import { DynamicDeadline } from '@/src/components/common/DynamicDeadline'
import { TokenIcon } from '@/src/components/pools/common/TokenIcon'
import { Badge } from '@/src/components/pureStyledComponents/common/Badge'
import {
  HideOnDesktop as BaseHideOnDesktop,
  Cell,
  HideOnMobile,
  HideOnMobileCell,
  RowLink,
  TableBody,
  TableHead,
} from '@/src/components/pureStyledComponents/common/Table'
import { NameCell } from '@/src/components/table/NameCell'
import { SortableTH } from '@/src/components/table/SortableTH'
import { Stage } from '@/src/components/table/Stage'
import { getKeyChainByValue, getNetworkConfig } from '@/src/constants/chains'
import { poolStagesText } from '@/src/constants/pool'
import useAelinVouchedPools from '@/src/hooks/aelin/useAelinVouchedPools'
import { useNotifications } from '@/src/providers/notificationsProvider'
import { isPrivatePool } from '@/src/utils/aelinPoolUtils'
import { getFormattedDurationFromDateToNow } from '@/src/utils/date'

const Wrapper = styled.div`
  margin: 20px 0 30px 0px;
`

const Name = styled.span`
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`

const TokenIconSmall = styled(TokenIcon)`
  margin-left: 5px;
  margin-top: -2px;

  .externalLink {
    font-size: 1.2rem !important;
  }
`

const Label = styled.span`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 5px;
  padding: 2px 8px;
  background: ${({ theme }) => theme.buttonPrimary.backgroundColor};
  border: 0.5px solid ${({ theme }) => theme.colors.primary};
  border-radius: 8px;
  color: ${({ theme }) => theme.colors.primary};
  font-weight: 500;
  font-size: 10px;
  line-height: 14px;
`

const Title = styled.h3`
  display: flex;
  align-items: center;
  color: ${({ theme: { card } }) => card.titleColor};
  font-family: ${({ theme }) => theme.fonts.fontFamilyTitle};
  font-size: 1.4rem;
  font-weight: 700;
  line-height: 1.2;
  margin: 10px 0;
  padding: 0;

  @media (min-width: ${({ theme }) => theme.themeBreakPoints.tabletPortraitStart}) {
    font-size: 1.8rem;
  }
`

const HideOnDesktop = styled(BaseHideOnDesktop)`
  .networkIcon {
    height: 14px;
    width: 14px;
  }
`

export const VouchedPools: React.FC = () => {
  const { data, error } = useAelinVouchedPools({
    orderBy: PoolCreated_OrderBy.Timestamp,
  })

  const { notifications } = useNotifications()

  const columns = {
    alignment: {
      investmentToken: 'center',
      network: 'center',
    },
    widths: '190px 120px 90px 0.8fr 1fr 165px 80px',
  }

  const tableHeaderCells = [
    {
      title: 'Name',
    },
    {
      title: 'Sponsor',
    },
    {
      title: 'Network',
    },
    {
      title: 'Amount in Pool',
    },
    {
      title: 'Investment deadline',
    },
    {
      title: 'Investment token',
      justifyContent: columns.alignment.investmentToken,
    },
    {
      title: 'Stage',
    },
  ]

  if (error) {
    throw error
  }

  if (!data || !data.length) return null

  return (
    <>
      <Title>
        Verified Pools &nbsp;
        <Verified />
      </Title>
      <Wrapper>
        <TableHead columns={columns.widths}>
          {tableHeaderCells.map(({ justifyContent, title }, index) => (
            <SortableTH justifyContent={justifyContent} key={index}>
              {title}
            </SortableTH>
          ))}
        </TableHead>
        <TableBody>
          {data.map((pool) => {
            const {
              address: id,
              chainId: network,
              funded,
              investmentToken,
              investmentTokenSymbol,
              nameFormatted,
              purchaseExpiry,
              sponsor,
              stage,
              start,
            } = pool
            const activeNotifications = notifications.filter((n) => n.poolAddress === id).length

            return (
              <RowLink
                columns={columns.widths}
                href={`/pool/${getKeyChainByValue(network)}/${id}`}
                key={id}
                withGradient
              >
                <NameCell>
                  <Name>{nameFormatted}</Name>
                  {!!activeNotifications && (
                    <Badge
                      data-html={true}
                      data-multiline={true}
                      data-tip={`You have ${
                        activeNotifications > 1 ? 'notifications' : 'one notification'
                      } for this pool.`}
                    >
                      {activeNotifications.toString()}
                    </Badge>
                  )}
                  {isPrivatePool(pool.poolType) && (
                    <Label>
                      <span>private</span>
                      <Lock />
                    </Label>
                  )}

                  {!!pool.hasNftList && (
                    <Label>
                      <span>NFT</span>
                      <Lock />
                    </Label>
                  )}
                  <HideOnDesktop>{getNetworkConfig(network).icon}</HideOnDesktop>
                </NameCell>
                <ENSOrAddress address={sponsor} network={network} />
                <HideOnMobileCell
                  justifyContent={columns.alignment.network}
                  title={getNetworkConfig(network).name}
                >
                  {getNetworkConfig(network).icon}
                </HideOnMobileCell>
                <Cell>
                  {funded.formatted}
                  &nbsp;
                  <HideOnMobile>{investmentTokenSymbol}</HideOnMobile>
                  <HideOnDesktop>
                    <TokenIconSmall
                      address={investmentToken}
                      iconHeight={12}
                      iconWidth={12}
                      network={network}
                      symbol={investmentTokenSymbol}
                      type="row"
                    />
                  </HideOnDesktop>
                </Cell>
                <DynamicDeadline
                  deadline={purchaseExpiry}
                  hideWhenDeadlineIsReached={false}
                  start={start}
                >
                  {getFormattedDurationFromDateToNow(purchaseExpiry)}
                </DynamicDeadline>
                <HideOnMobileCell justifyContent={columns.alignment.investmentToken}>
                  <TokenIcon
                    address={investmentToken}
                    network={network}
                    symbol={investmentTokenSymbol}
                    type="column"
                  />
                </HideOnMobileCell>
                <Stage stage={stage}> {poolStagesText[stage]}</Stage>
              </RowLink>
            )
          })}
        </TableBody>
      </Wrapper>
    </>
  )
}
