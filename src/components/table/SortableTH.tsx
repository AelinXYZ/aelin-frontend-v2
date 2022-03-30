import styled from 'styled-components'

import { Sort as BaseSort } from '@/src/components/assets/Sort'
import { TH } from '@/src/components/pureStyledComponents/common/Table'

const Wrapper = styled(TH)`
  cursor: pointer;
  gap: 10px;

  &:active {
    opacity: 0.7;
  }
`

const Sort = styled(BaseSort)<{ isActive?: boolean }>`
  flex-shrink: 0;
  opacity: ${({ isActive }) => (isActive ? 1 : 0.2)};
`

export const SortableTH: React.FC<{
  isActive?: boolean
  justifyContent?: string
  onClick?: () => void
}> = ({ children, isActive, onClick, ...restProps }) => {
  return (
    <Wrapper onClick={onClick} {...restProps}>
      {children}
      {onClick && <Sort isActive={isActive} />}
    </Wrapper>
  )
}
