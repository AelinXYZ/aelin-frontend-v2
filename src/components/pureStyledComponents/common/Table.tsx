import Link from 'next/link'
import { lighten } from 'polished'
import styled, { css } from 'styled-components'

export const Table = styled.div`
  min-width: fit-content;
  width: 100%;
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
  grid-template-columns: ${({ columns }) => columns};
  padding-left: 28px;
  padding-right: 16px;
  text-decoration: none;
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
  margin-bottom: 10px;
  min-height: 48px;
  padding-bottom: 10px;
  padding-top: 10px;
  transition: background-color 0.1s linear;

  &:last-child {
    margin-bottom: 0;
  }

  ${({ hasHover }) => hasHover && RowHover}

  &[href] {
    ${RowHover}
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
  ${RowCSS}

  margin-bottom: 18px;
`

TableHead.defaultProps = {
  columns: '1fr',
  hasHover: false,
}

export const Cell = styled.span<{ justifyContent?: string; light?: boolean }>`
  align-items: center;
  color: ${({ light, theme: { colors } }) => (light ? colors.textColor : colors.textColorLight)};
  display: flex;
  font-size: 1.4rem;
  font-weight: 500;
  height: 100%;
  height: fit-content;
  justify-content: ${({ justifyContent }) => justifyContent};
  line-height: 1.2;
  margin-top: 3px;
  min-width: 0;
`

Cell.defaultProps = {
  justifyContent: 'flex-start',
  light: false,
}

export const LinkCell = styled(Cell)`
  column-gap: 15px;
  min-width: fit-content;
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
