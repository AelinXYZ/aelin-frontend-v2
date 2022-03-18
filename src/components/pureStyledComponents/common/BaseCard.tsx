import styled, { css } from 'styled-components'

export const BaseCardCSS = css`
  background-color: ${(props) => props.theme.card.backgroundColor};
  border-radius: ${({ theme }) => theme.card.borderRadius};
  border: ${(props) => props.theme.card.borderColor};
  padding: 20px 20px;
  width: 100%;
`

export const BaseCard = styled.div`
  ${BaseCardCSS}
`
