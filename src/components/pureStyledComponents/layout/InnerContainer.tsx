import styled from 'styled-components'

import { ContainerPadding } from '@/src/components/pureStyledComponents/layout/ContainerPadding'

export const InnerContainer = styled.div`
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
  margin: 0 auto;
  max-width: 100vw;
  width: ${({ theme }) => theme.layout.maxWidth};

  ${ContainerPadding}
`
