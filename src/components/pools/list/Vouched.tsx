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
  widths: '280px 84px 75px 0.8fr 1fr 150px 80px',
  compactWidths: '260px 84px 70px 1fr 80px',
}

const compactRowEnd = '1400px'

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
  @media (min-width: ${({ theme }) =>
    theme.themeBreakPoints.tabletLandscapeStart}) and (max-width: ${compactRowEnd}) {
    grid-template-columns: ${columns.compactWidths};
  }}
`

const SortableTH = styled(BaseSortableTH)<{ isSecondary?: boolean }>`
  ${({ isSecondary }) =>
    isSecondary &&
    css`
      @media (min-width: ${({ theme }) =>
          theme.themeBreakPoints.tabletLandscapeStart}) and (max-width: ${compactRowEnd}) {
        display: none;
      }
    `}
`

const RowLink = styled(BaseRowLink)`
  @media (min-width: ${({ theme }) =>
      theme.themeBreakPoints.tabletLandscapeStart}) and (max-width: ${compactRowEnd}) {
    grid-template-columns: ${columns.compactWidths};
  }
`

const DynamicDeadline = styled(BaseDynamicDeadline)`
  @media (min-width: ${({ theme }) =>
      theme.themeBreakPoints.tabletLandscapeStart}) and (max-width: ${compactRowEnd}) {
    display: none;
  }
`

const InvestmentToken = styled(Cell)`
  @media (max-width: ${compactRowEnd}) {
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
    },
    {
      title: 'Sponsor',
    },
    {
      title: 'Network',
    },
    {
      title: 'Total deposited',
    },
    {
      title: 'Investment deadline',
      isSecondary: true,
    },
    {
      title: 'Investment token',
      justifyContent: columns.alignment.investmentToken,
      isSecondary: true,
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
          {tableHeaderCells.map(({ isSecondary, justifyContent, title }, index) => (
            <SortableTH isSecondary={isSecondary} justifyContent={justifyContent} key={index}>
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
