import styled, { css } from 'styled-components'

import { PoolCreated_OrderBy } from '@/graphql-schema'
import ENSOrAddress from '@/src/components/aelin/ENSOrAddress'
import { Lock } from '@/src/components/assets/Lock'
import { Verified } from '@/src/components/assets/Verified'
import { DynamicDeadline as BaseDynamicDeadline } from '@/src/components/common/DynamicDeadline'
import { TokenIcon } from '@/src/components/pools/common/TokenIcon'
import { Badge } from '@/src/components/pureStyledComponents/common/Badge'
import {
  HideOnDesktop as BaseHideOnDesktop,
  RowLink as BaseRowLink,
  TableHead as BaseTableHead,
  Cell,
  HideOnMobile,
  HideOnMobileCell,
  TableBody,
} from '@/src/components/pureStyledComponents/common/Table'
import { NameCell } from '@/src/components/table/NameCell'
import { SortableTH as BaseSortableTH } from '@/src/components/table/SortableTH'
import { Stage } from '@/src/components/table/Stage'
import { getKeyChainByValue, getNetworkConfig } from '@/src/constants/chains'
import { poolStagesText } from '@/src/constants/pool'
import useAelinVouchedPools from '@/src/hooks/aelin/useAelinVouchedPools'
import { useNotifications } from '@/src/providers/notificationsProvider'
import { isMerklePool, isPrivatePool } from '@/src/utils/aelinPoolUtils'
import { getFormattedDurationFromDateToNow } from '@/src/utils/date'

const columns = {
  alignment: {
    investmentToken: 'center',
    network: 'center',
  },
  largeWidths: '280px 84px 75px 0.8fr 1fr 150px 80px',
  mediumWidths: '280px 84px 75px 0.8fr 1fr 80px',
  smallWidths: '260px 84px 70px 1fr 80px',
}

const firstMediumRowStart = 900
const secondMediumRowStart = 1200
const largeRowStart = 1400

enum CellPriority {
  First,
  Second,
  Third,
}

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
  font-size: 9px;
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

const LabelsWrapper = styled.div`
  display: flex;
  gap: 5px;
`

const TableHead = styled(BaseTableHead)`
  @media (min-width: ${({ theme }) => theme.themeBreakPoints.tabletLandscapeStart}) {
    grid-template-columns: ${columns.smallWidths};
  }

  @media (min-width: ${firstMediumRowStart}px) {
    grid-template-columns: ${columns.mediumWidths};
  }

  @media (min-width: ${({ theme }) => theme.themeBreakPoints.desktopStart}) {
    grid-template-columns: ${columns.smallWidths};
  }

  @media (min-width: ${secondMediumRowStart}px) {
    grid-template-columns: ${columns.mediumWidths};
  }

  @media (min-width: ${largeRowStart}px) {
    grid-template-columns: ${columns.largeWidths};
  }
`

const SortableTH = styled(BaseSortableTH)<{ priority: CellPriority }>`
  ${({ priority }) => {
    switch (priority) {
      case CellPriority.First:
        return null
      case CellPriority.Second:
        return css`
          @media (min-width: ${({ theme }) =>
              theme.themeBreakPoints.tabletLandscapeStart}) and (max-width: ${firstMediumRowStart -
            1}px) {
            display: none;
          }

          @media (min-width: ${({ theme }) =>
              theme.themeBreakPoints.desktopStart}) and (max-width: ${secondMediumRowStart - 1}px) {
            display: none;
          }
        `
      case CellPriority.Third:
        return css`
          @media (min-width: ${({ theme }) =>
              theme.themeBreakPoints.tabletLandscapeStart}) and (max-width: ${largeRowStart -
            1}px) {
            display: none;
          }
        `
    }
  }}
`

const RowLink = styled(BaseRowLink)`
  @media (min-width: ${({ theme }) => theme.themeBreakPoints.tabletLandscapeStart}) {
    grid-template-columns: ${columns.smallWidths};
  }

  @media (min-width: ${firstMediumRowStart}px) {
    grid-template-columns: ${columns.mediumWidths};
  }

  @media (min-width: ${({ theme }) => theme.themeBreakPoints.desktopStart}) {
    grid-template-columns: ${columns.smallWidths};
  }

  @media (min-width: ${secondMediumRowStart}px) {
    grid-template-columns: ${columns.mediumWidths};
  }

  @media (min-width: ${largeRowStart}px) {
    grid-template-columns: ${columns.largeWidths};
  }
`

const DynamicDeadline = styled(BaseDynamicDeadline)`
  @media (min-width: ${({ theme }) =>
      theme.themeBreakPoints.tabletLandscapeStart}) and (max-width: ${largeRowStart - 1}px) {
    display: none;
  }
`

const InvestmentToken = styled(Cell)`
  @media (max-width: ${firstMediumRowStart - 1}px) {
    display: none;
  }

  @media (min-width: ${({ theme }) =>
      theme.themeBreakPoints.desktopStart}) and (max-width: ${secondMediumRowStart - 1}px) {
    display: none;
  }
`

export const VouchedPools: React.FC = () => {
  const { data, error } = useAelinVouchedPools({
    orderBy: PoolCreated_OrderBy.Timestamp,
  })

  const { notifications } = useNotifications()

  const tableHeaderCells = [
    {
      title: 'Name',
      priority: CellPriority.First,
    },
    {
      title: 'Sponsor',
      priority: CellPriority.First,
    },
    {
      title: 'Network',
      priority: CellPriority.First,
    },
    {
      title: 'Total deposited',
      priority: CellPriority.First,
    },
    {
      title: 'Investment deadline',
      priority: CellPriority.Third,
    },
    {
      title: 'Investment token',
      justifyContent: columns.alignment.investmentToken,
      priority: CellPriority.Second,
    },
    {
      title: 'Stage',
      priority: CellPriority.First,
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
        <TableHead columns={columns.largeWidths}>
          {tableHeaderCells.map(({ justifyContent, priority, title }, index) => (
            <SortableTH justifyContent={justifyContent} key={index} priority={priority}>
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
                columns={columns.largeWidths}
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
                  <HideOnMobile>
                    <LabelsWrapper>
                      {isPrivatePool(pool.poolType) && (
                        <Label>
                          <span>Private</span>
                          <Lock />
                        </Label>
                      )}

                      {isMerklePool(pool) && (
                        <Label>
                          <span>Merkle Tree</span>
                          <Lock />
                        </Label>
                      )}

                      {!!pool.hasNftList && (
                        <Label>
                          <span>NFT</span>
                          <Lock />
                        </Label>
                      )}

                      {!!pool.upfrontDeal && (
                        <Label>
                          <span>Deal</span>
                        </Label>
                      )}
                    </LabelsWrapper>
                  </HideOnMobile>
                </NameCell>
                <HideOnDesktop>
                  <LabelsWrapper>
                    {isPrivatePool(pool.poolType) && (
                      <Label>
                        <span>Private</span>
                        <Lock />
                      </Label>
                    )}

                    {isMerklePool(pool) && (
                      <Label>
                        <span>Merkle Tree</span>
                        <Lock />
                      </Label>
                    )}

                    {!!pool.hasNftList && (
                      <Label>
                        <span>NFT</span>
                        <Lock />
                      </Label>
                    )}

                    {!!pool.upfrontDeal && (
                      <Label>
                        <span>Deal</span>
                      </Label>
                    )}
                    <HideOnDesktop>{getNetworkConfig(network).icon}</HideOnDesktop>
                  </LabelsWrapper>
                </HideOnDesktop>
                <ENSOrAddress address={sponsor} network={network} />
                <HideOnMobileCell
                  justifyContent={columns.alignment.network}
                  title={getNetworkConfig(network).shortName}
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
                <InvestmentToken justifyContent={columns.alignment.investmentToken}>
                  <TokenIcon
                    address={investmentToken}
                    network={network}
                    symbol={investmentTokenSymbol}
                    type="column"
                  />
                </InvestmentToken>
                <Stage stage={stage}> {poolStagesText[stage]}</Stage>
              </RowLink>
            )
          })}
        </TableBody>
      </Wrapper>
    </>
  )
}
