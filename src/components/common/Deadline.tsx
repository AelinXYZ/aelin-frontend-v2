import styled from 'styled-components'

import { ProgressBar as BaseProgressBar } from '@/src/components/common/ProgressBar'
import { Cell } from '@/src/components/pureStyledComponents/common/Table'

const Wrapper = styled(Cell)<{ width?: string }>`
  align-items: flex-start;
  color: ${({ theme }) => theme.colors.textColorLight};
  flex-direction: column;
  gap: 0;
  justify-content: center;
  max-width: 100%;
  width: ${({ width }) => width};
`

Wrapper.defaultProps = {
  width: '100%',
}

const ProgressBar = styled(BaseProgressBar)`
  margin-bottom: 6.5px;
  width: 100%;
`

const Value = styled.div`
  font-size: 12px;
  line-height: 1.2;
  font-weight: 500;
  text-transform: capitalize;
`

export const Deadline: React.FC<{ progress: string; width?: string }> = ({
  children,
  progress,
  width,
  ...restProps
}) => {
  return (
    <Wrapper width={width} {...restProps}>
      <ProgressBar progress={progress} />
      <Value>{children}</Value>
    </Wrapper>
  )
}
