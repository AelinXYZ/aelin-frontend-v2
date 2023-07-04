import { ReactNode } from 'react'
import styled from 'styled-components'

type ErrorProps = {
  children: ReactNode
  textAlign?: 'center' | 'left' | 'right' | 'justify'
  margin?: string
}

const Text = styled.p<{ textAlign?: 'center' | 'left' | 'right' | 'justify'; margin?: string }>`
  color: ${({ theme }) => theme.colors.error};
  font-size: 0.9rem;
  font-weight: normal;
  line-height: 1.2;
  margin: ${({ margin }) => margin};
  max-width: 100%;
  text-align: ${({ textAlign }) => textAlign};
  width: 100%;

  &:last-child {
    margin-bottom: 0;
  }
`

Text.defaultProps = {
  textAlign: 'left',
  margin: '10px 0',
}

export const Error = ({ children, margin, textAlign }: ErrorProps) => (
  <Text margin={margin} textAlign={textAlign}>
    {children}
  </Text>
)
