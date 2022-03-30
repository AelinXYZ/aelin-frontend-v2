import styled from 'styled-components'

import { Badge } from '@/src/components/pureStyledComponents/common/Badge'
import { Cell } from '@/src/components/pureStyledComponents/common/Table'

const Wrapper = styled(Cell)`
  color: ${({ theme }) => theme.colors.textColor};
  gap: 10px;
`

export const NameCell: React.FC<{ badge?: string }> = ({ badge, children, ...restProps }) => {
  return (
    <Wrapper {...restProps}>
      {children} {badge && <Badge>{badge}</Badge>}
    </Wrapper>
  )
}
