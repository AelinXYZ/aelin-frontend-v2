import styled, { css } from 'styled-components'

export const BaseCardCSS = css`
  background-color: ${({ theme: { card } }) => card.backgroundColor};
  border-radius: 8px;
  border: ${({ theme: { card } }) => card.borderColor};
  padding: 20px;
  backdrop-filter: ${({ theme: { card } }) => card.backdropFilter};
`

export const BaseCard = styled.div`
  ${BaseCardCSS}
`
