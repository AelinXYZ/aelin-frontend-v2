import styled from 'styled-components'

import { Badge } from '@/src/components/pureStyledComponents/common/Badge'
import { Cell } from '@/src/components/pureStyledComponents/common/Table'

const Wrapper = styled(Cell)`
  color: ${({ theme }) => theme.colors.textColor};
  gap: 10px;
`

const Text = styled.div`
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`

export const NameCell: React.FC<{ badge?: string }> = ({ badge, children, ...restProps }) => {
  return (
    <Wrapper {...restProps}>
      <Text>{children}</Text> {badge && <Badge>{badge}</Badge>}
    </Wrapper>
  )
}
