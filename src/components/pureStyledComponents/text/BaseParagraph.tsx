import styled from 'styled-components'

export const BaseParagraph = styled.p`
  color: ${({ theme }) => theme.colors.textColor};
  font-size: 1.5rem;
  font-weight: normal;
  line-height: 1.6;
  margin: 0 0 20px;
  max-width: 100%;
  text-align: center;

  &:last-child,
  &:last-of-type {
    margin-bottom: 0;
  }
`
