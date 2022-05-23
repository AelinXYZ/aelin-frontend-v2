import styled from 'styled-components'

import { Cell, CellProps } from '@/src/components/pureStyledComponents/common/Table'

const Wrapper = styled.div`
  color: ${({ theme }) => theme.colors.textColor};
  font-weight: 500;
  gap: 10px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`

export const NameCell: React.FC<CellProps> = ({ children, ...restProps }) => {
  return (
    <Wrapper as={Cell} {...restProps}>
      {children}
    </Wrapper>
  )
}
