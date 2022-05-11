import styled from 'styled-components'

export const Filters = styled.div<{ justifyContent: 'space-between' | 'flex-start' }>`
  display: flex;
  gap: 6px;
  justify-content: ${({ justifyContent }) => justifyContent}};
  margin-bottom: 20px;
`
