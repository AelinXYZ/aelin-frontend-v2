import styled, { css } from 'styled-components'

export const Table = styled.div`
  min-width: fit-content;
  width: 100%;
`

interface RowProps {
  columns?: string
}

export const RowCSS = css<RowProps>`
  align-items: center;
  color: ${({ theme }) => theme.colors.textColor};
  column-gap: 15px;
  display: grid;
  grid-template-columns: ${({ columns }) => columns};
  padding-left: 10px;
  padding-right: 10px;
`

export const Row = styled.div<RowProps>`
  ${RowCSS}

  height: 42px;
  transition: background-color 0.1s linear;

  &[href] {
    cursor: pointer;
    text-decoration: none;
  }
`

export const TableHead = styled.div<RowProps>`
  ${RowCSS}
`

TableHead.defaultProps = {
  className: 'tableHead',
}

export const Cell = styled.span<{ flexDirection?: string; justifyContent?: string }>`
  align-items: center;
  display: flex;
  height: 100%;
  flex-direction: ${({ flexDirection }) => flexDirection};
  justify-content: ${({ justifyContent }) => justifyContent};
  white-space: nowrap;
`

Cell.defaultProps = {
  flexDirection: 'row',
  justifyContent: 'flex-start',
}

export const TH = styled(Cell)`
  color: ${({ theme }) => theme.colors.textColor};
  font-size: 1.4rem;
  font-weight: 500;
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
