import styled from 'styled-components'

import { ProgressBar as BaseProgressBar } from '@/src/components/common/ProgressBar'
import { Cell } from '@/src/components/pureStyledComponents/common/Table'

const Wrapper = styled(Cell)`
  align-items: flex-start;
  color: ${({ theme }) => theme.colors.textColorLight};
  flex-direction: column;
  gap: 0;
  justify-content: center;
`

const ProgressBar = styled(BaseProgressBar)`
  margin-bottom: 6.5px;
  width: 120px;
`

const Value = styled.div`
  font-size: 12px;
  line-height: 1.2;
  font-weight: 500;
  text-transform: capitalize;
`

export const Deadline: React.FC<{ progress: string }> = ({ children, progress, ...restProps }) => {
  return (
    <Wrapper {...restProps}>
      <ProgressBar progress={progress} />
      <Value>{children}</Value>
    </Wrapper>
  )
}
