import styled, { css } from 'styled-components'

export const BaseCardCSS = css`
  background-color: ${({ theme: { card } }) => card.backgroundColor};
  border-radius: ${({ theme: { card } }) => card.borderRadius};
  border: ${({ theme: { card } }) => card.borderColor};
  padding: 20px 20px;
`

export const BaseCard = styled.div`
  ${BaseCardCSS}
`
