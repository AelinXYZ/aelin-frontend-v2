import styled from 'styled-components'

export const TextPrimary = styled.span<{ fontWeight?: string }>`
  color: ${({ theme }) => theme.colors.primary};
  font-weight: ${({ fontWeight }) => fontWeight};
`

TextPrimary.defaultProps = {
  fontWeight: '400',
}
