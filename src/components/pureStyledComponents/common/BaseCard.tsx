import styled, { css } from 'styled-components'

export const BaseCardCSS = css`
  background-color: ${({ theme: { card } }) => card.backgroundColor};
  border-radius: 8px;
  border: ${({ theme: { card } }) => card.borderColor};
  padding: 20px;
  position: relative;
  font-size: 0.9rem;

  /* pseudo element to apply background blur - applying directly doesn't render correctly.. */
  &:before {
    content: '';
    position: absolute;
    width: 100%;
    height: 100%;
    z-index: -1;
  }
`

export const BaseCard = styled.div`
  ${BaseCardCSS}
`
