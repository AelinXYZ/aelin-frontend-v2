import Link from 'next/link'
import { lighten } from 'polished'
import styled, { css, keyframes } from 'styled-components'

const loadingAnimation = keyframes`
  0% {
    opacity: 0.6;
  }

  50% {
    opacity: 1;
  }

  100% {
    opacity: 0.6;
  }
`

export const Table = styled.div`
  min-width: fit-content;
  width: 100%;
`

export const TableBody = styled.div`
  column-gap: 15px;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  row-gap: 20px;

  @media (min-width: ${({ theme }) => theme.themeBreakPoints.tabletPortraitStart}) {
    grid-template-columns: repeat(4, 1fr);
  }

  @media (min-width: ${({ theme }) => theme.themeBreakPoints.tabletLandscapeStart}) {
    grid-template-columns: 1fr;

    row-gap: 10px;
  }
`

interface RowProps {
  columns?: string
  hasHover?: boolean
}

export const RowCSS = css<RowProps>`
  align-items: center;
  color: ${({ theme }) => theme.colors.textColor};
  column-gap: 10px;
  display: grid;
  padding: 12px 15px;
  row-gap: 10px;
  text-decoration: none;

  @media (min-width: ${({ theme }) => theme.themeBreakPoints.tabletLandscapeStart}) {
    grid-template-columns: ${({ columns }) => columns};
    padding-left: 28px;
    padding-right: 16px;
  }
`

const RowHover = css`
  &:hover {
    background-color: ${({ theme }) => lighten(0.1, theme.card.backgroundColor)};
    cursor: pointer;
    text-decoration: none;

    &:active {
      opacity: 0.7;
    }
  }
`

export const TableRowCSS = css<RowProps>`
  ${RowCSS}

  background-color: ${({ theme }) => theme.card.backgroundColor};
  border-radius: ${({ theme }) => theme.card.borderRadius};
  border: ${({ theme }) => theme.card.borderColor};
  min-height: 48px;
  transition: background-color 0.1s linear;

  ${({ hasHover }) => hasHover && RowHover}

  &[href] {
    ${RowHover}
  }

  @media (min-width: ${({ theme }) => theme.themeBreakPoints.tabletLandscapeStart}) {
    padding-bottom: 10px;
    padding-top: 10px;
  }
`

export const Row = styled.div<RowProps>`
  ${TableRowCSS}
`

interface RowLinkProps extends RowProps {
  href: string
}

export const RowLink: React.FC<RowLinkProps> = ({ children, href, ...restProps }) => {
  return (
    <Link href={href} passHref>
      <Row as="a" {...restProps}>
        {children}
      </Row>
    </Link>
  )
}

Row.defaultProps = {
  columns: '1fr',
  hasHover: false,
}

export const TableHead = styled.div<RowProps>`
  display: none;

  @media (min-width: ${({ theme }) => theme.themeBreakPoints.tabletLandscapeStart}) {
    ${RowCSS}

    margin-bottom: 8px;
  }
`

TableHead.defaultProps = {
  columns: '1fr',
  hasHover: false,
}

export const Cell = styled.span<{ justifyContent?: string; light?: boolean }>`
  align-items: center;
  color: ${({ light, theme: { colors } }) => (light ? colors.textColor : colors.textColorLight)};
  display: flex;
  font-size: 1.2rem;
  font-weight: 500;
  height: 100%;
  height: fit-content;
  justify-content: ${({ justifyContent }) => justifyContent};
  line-height: 1.2;
  margin-top: 3px;
  min-width: 0;

  @media (min-width: ${({ theme }) => theme.themeBreakPoints.tabletLandscapeStart}) {
    font-size: 1.4rem;
  }
`

Cell.defaultProps = {
  justifyContent: 'flex-start',
  light: false,
}

export const LinkCell = styled(Cell)`
  column-gap: 15px;
  min-width: fit-content;
`

export const HideOnMobileCell = styled(Cell)`
  display: none;

  @media (min-width: ${({ theme }) => theme.themeBreakPoints.tabletLandscapeStart}) {
    display: grid;
  }
`

export const HideOnDesktop = styled.span`
  @media (min-width: ${({ theme }) => theme.themeBreakPoints.tabletLandscapeStart}) {
    display: none;
  }
`

export const TH = styled(Cell)`
  color: ${({ theme }) => theme.colors.textColor};
  font-family: ${({ theme }) => theme.fonts.fontFamilyTitle};
  font-size: 1.4rem;
  font-weight: 700;
  line-height: 1.2;
  white-space: nowrap;
`

TH.defaultProps = {
  className: 'th',
}

export const CellText = styled.span`
  color: ${({ theme }) => theme.colors.textColor};
  font-size: 1.5rem;
  font-weight: 500;
  line-height: 1.2;
`

export const TableWrapper = styled.div`
  overflow-x: auto;
  overflow-y: none;
  width: 100%;
`

const Loading = styled.span`
  animation-delay: 0;
  animation-duration: 2s;
  animation-iteration-count: infinite;
  animation-name: ${loadingAnimation};
  animation-timing-function: ease-in-out;
  color: ${({ theme }) => theme.colors.textLight};
  font-style: italic;
`

export const LoadingTableRow: React.FC<{ text?: string }> = ({
  text = 'Loading...',
  ...restProps
}) => (
  <Row columns={'1fr'} style={{ marginTop: '10px' }} {...restProps}>
    <Cell justifyContent="center">
      <Loading>{text}</Loading>
    </Cell>
  </Row>
)
