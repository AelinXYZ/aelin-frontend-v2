import styled from 'styled-components'

import { ContainerPadding } from '@/src/components/pureStyledComponents/layout/ContainerPadding'

export const InnerContainer = styled.div`
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  flex-shrink: 0;
  margin: 0 auto;
  max-width: ${({ theme }) => theme.layout.maxWidth};
  width: 100vw;

  ${ContainerPadding}
`
