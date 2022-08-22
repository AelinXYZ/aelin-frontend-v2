import styled from 'styled-components'

export const Error = styled.p<{ textAlign?: 'center' | 'left' | 'right' | 'justify' }>`
  color: ${({ theme }) => theme.colors.error};
  font-size: 1.4rem;
  font-weight: normal;
  line-height: 1.2;
  margin: 0;
  margin: 20px;
  max-width: 100%;
  text-align: ${({ textAlign }) => textAlign};
  width: 100%;

  &:last-child {
    margin-bottom: 0;
  }
`

Error.defaultProps = {
  textAlign: 'left',
}
