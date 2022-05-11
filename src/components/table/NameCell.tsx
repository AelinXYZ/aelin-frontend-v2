import styled from 'styled-components'

import { Badge } from '@/src/components/pureStyledComponents/common/Badge'
import { Cell } from '@/src/components/pureStyledComponents/common/Table'

const Wrapper = styled(Cell)`
  color: ${({ theme }) => theme.colors.textColor};
  font-weight: 500;
  gap: 10px;
`

const Text = styled.div`
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`

export const NameCell: React.FC<{ name: string | undefined; badge?: string }> = ({
  badge,
  children,
  name,
  ...restProps
}) => {
  return (
    <Wrapper {...restProps}>
      <Text>{name}</Text> {badge && <Badge>{badge}</Badge>} {children}
    </Wrapper>
  )
}
