import { ReactNode } from 'react'
import styled from 'styled-components'

import { Cell } from '@/src/components/pureStyledComponents/common/Table'

const Wrapper = styled.div`
  color: ${({ theme }) => theme.colors.textColor};
  font-weight: 500;
  gap: 10px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`

type NameCellProps = {
  children: ReactNode
  justifyContent?: string
  light?: boolean
  mobileJustifyContent?: string
}

export const NameCell = ({ children }: NameCellProps) => {
  return <Wrapper as={Cell}>{children}</Wrapper>
}
