import { useRouter } from 'next/router'
import { ChangeEvent, useEffect, useMemo, useRef, useState } from 'react'
import styled, { css } from 'styled-components'

import { debounce } from 'lodash'

import { genericSuspense } from '../../helpers/SafeSuspense'
import env from '@/config/env'
import ENSOrAddress from '@/src/components/aelin/ENSOrAddress'
import { Lock } from '@/src/components/assets/Lock'
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
  Row,
  TableBody,
} from '@/src/components/pureStyledComponents/common/Table'
import { Search as BaseSearch } from '@/src/components/pureStyledComponents/form/Search'
import { NameCell } from '@/src/components/table/NameCell'
import { SortableTH as BaseSortableTH } from '@/src/components/table/SortableTH'
import { Stage } from '@/src/components/table/Stage'
import { getKeyChainByValue, getNetworkConfig } from '@/src/constants/chains'
import { DEBOUNCED_INPUT_TIME } from '@/src/constants/misc'
import { poolStagesText } from '@/src/constants/pool'
import useAelinVouchedPools from '@/src/hooks/aelin/vouched-pools/useAelinVouchedPools'
import usePrevious from '@/src/hooks/common/usePrevious'
import { useEnsLookUpAddress } from '@/src/hooks/useEnsResolvers'
import { useNotifications } from '@/src/providers/notificationsProvider'
import { isMerklePool, isPrivatePool } from '@/src/utils/aelinPoolUtils'
import { getFormattedDurationFromDateToNow } from '@/src/utils/date'

const Search = styled(BaseSearch)`
  position: relative;
  width: 200px;
  z-index: 1;
  background-image: none;
  padding-left: 15px;
  color: ${({ theme }) => theme.colors.primary};
`

const columns = {
  alignment: {
    investmentToken: 'center',
    network: 'center',
  },
  largeWidths: '254px 110px 75px 0.8fr 1fr 150px 80px',
  mediumWidths: '334px 110px 75px 0.8fr 1fr 80px',
  smallWidths: '334px 110px 70px 1fr 80px',
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
    font-size: 0.8rem !important;
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
  font-size: 1rem;
  font-weight: 700;
  line-height: 1.2;
  margin: 25px 0 0 0;
  padding: 0;
  @media (min-width: ${({ theme }) => theme.themeBreakPoints.tabletPortraitStart}) {
    font-size: 1.2rem;
  }
`

const HideOnDesktop = styled(BaseHideOnDesktop)`
  .networkIcon {
    height: 14px;
    width: 14px;
  }
`

const NoPoolsWrapper = styled(Row)`
  text-align: center;
  font-size: 0.9rem;
`

const LoadingWrapper = styled(NoPoolsWrapper)`
  font-style: italic;
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

type TableDataProps = {
  isTyping: boolean
  voucherAddress: string
}

const aelinVoucherENS = env.NEXT_PUBLIC_AELIN_VOUCHER_ENS_ADDRESS as string

const Loading = () => <LoadingWrapper> loading... </LoadingWrapper>

const TableData = genericSuspense(
  ({ isTyping, voucherAddress }: TableDataProps) => {
    const { data, error } = useAelinVouchedPools()
    const { notifications } = useNotifications()

    if (error) {
      throw error
    }
    return (
      <TableBody>
        {!data.length && isTyping && <Loading />}
        {!data.length && !isTyping && <NoPoolsWrapper>No vouched pools found. </NoPoolsWrapper>}
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
              href={`/pool/${getKeyChainByValue(network)}/${id}/${
                voucherAddress ? `?voucher=${voucherAddress}` : ''
              }`}
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
    )
  },
  () => <Loading />,
)

export const VouchedPools: React.FC = () => {
  const router = useRouter()
  const {
    query: { voucher },
  } = router

  const [voucherAddress, setVoucherAddress] = useState<string>((voucher ?? '') as string)
  const searchRef = useRef<HTMLInputElement | null>(null)
  const prevVoucherAddress = usePrevious(voucherAddress)
  const [isTyping, setIsTyping] = useState<boolean>(false)

  const { data: ensVoucher } = useEnsLookUpAddress(voucher as string)

  const debouncedChangeHandler = useMemo(() => {
    return debounce((address: string) => {
      setVoucherAddress(address)
      setIsTyping(false)
    }, DEBOUNCED_INPUT_TIME)
  }, [setVoucherAddress, setIsTyping])

  const handleChangeVoucher = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.value) {
      setIsTyping(true)
      debouncedChangeHandler(e.target.value)
    }
  }

  const handleSearchOnBlur = (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.value) {
      const input = searchRef.current as HTMLInputElement
      input.value = aelinVoucherENS
      router.push(`/?voucher=${aelinVoucherENS}`, undefined, { shallow: true })
      setVoucherAddress(aelinVoucherENS)
    }
  }

  useEffect(() => {
    if (voucherAddress && voucherAddress !== prevVoucherAddress) {
      router.push(`/?voucher=${voucherAddress}`, undefined, { shallow: true })
    }
  }, [voucherAddress, prevVoucherAddress, router])

  useEffect(() => {
    const voucherAddress = ensVoucher || voucher
    if (!!voucherAddress && searchRef.current) {
      const input = searchRef.current as HTMLInputElement
      input.value = voucherAddress as string
    }
  }, [voucher, ensVoucher, searchRef])

  useEffect(() => {
    if (searchRef.current && !(searchRef.current as HTMLInputElement).value) {
      const input = searchRef.current as HTMLInputElement
      input.value = aelinVoucherENS
    }
  }, [searchRef])

  useEffect(() => {
    const voucherAddress = ensVoucher || voucher
    if (!voucherAddress) {
      const input = searchRef.current as HTMLInputElement
      input.value = aelinVoucherENS
    }
  }, [voucher, ensVoucher, searchRef])

  return (
    <>
      <Title>
        Pools vouched by &nbsp;
        <Search onBlur={handleSearchOnBlur} onChange={handleChangeVoucher} ref={searchRef} />
      </Title>
      <Wrapper>
        <TableHead columns={columns.largeWidths}>
          {tableHeaderCells.map(({ justifyContent, priority, title }, index) => (
            <SortableTH justifyContent={justifyContent} key={index} priority={priority}>
              {title}
            </SortableTH>
          ))}
        </TableHead>
        <TableData isTyping={isTyping} voucherAddress={voucherAddress} />
      </Wrapper>
    </>
  )
}
