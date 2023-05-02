import { ReactNode } from 'react'
import styled from 'styled-components'

type ErrorProps = {
  children: ReactNode
  textAlign?: 'center' | 'left' | 'right' | 'justify'
}

const Text = styled.p<{ textAlign?: 'center' | 'left' | 'right' | 'justify' }>`
  color: ${({ theme }) => theme.colors.error};
  font-size: 0.9rem;
  font-weight: normal;
  line-height: 1.2;
  margin: 10px 0;
  max-width: 100%;
  text-align: ${({ textAlign }) => textAlign};
  width: 100%;

  &:last-child {
    margin-bottom: 0;
  }
`

Text.defaultProps = {
  textAlign: 'left',
}

export const Error = ({ children, textAlign }: ErrorProps) => (
  <Text textAlign={textAlign}>{children}</Text>
)
