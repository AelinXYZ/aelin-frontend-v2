import styled from 'styled-components'

import { Cell } from '@/src/components/pureStyledComponents/common/Table'

const Wrapper = styled(Cell)`
  color: ${({ theme }) => theme.colors.textColor};
  font-weight: 500;
  gap: 10px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`

export const NameCell: React.FC<{ mobileJustifyContent?: string }> = ({
  children,
  ...restProps
}) => {
  return <Wrapper {...restProps}>{children}</Wrapper>
}
