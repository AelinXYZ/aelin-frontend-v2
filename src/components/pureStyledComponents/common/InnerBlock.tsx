import styled, { css } from 'styled-components'

const InnerBlockCSS = css`
  background-color: ${({ theme }) => theme.colors.grayDark};
  border-radius: 6px;
  border: 1px solid ${({ theme }) => theme.colors.grayDark};
  display: flex;
  flex-direction: column;
  min-height: 94px;
  padding: 14px 16px;
`

export const InnerBlock = styled.div`
  ${InnerBlockCSS}
`
