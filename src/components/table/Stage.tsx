import styled from 'styled-components'

import { Cell } from '@/src/components/pureStyledComponents/common/Table'

type StageTypes =
  | 'poolopen'
  | 'open'
  | 'fundingdeal'
  | 'seekingdeal'
  | 'dealopen'
  | 'dealready'
  | 'vesting'
  | 'complete'
  | string

const Wrapper = styled(Cell)`
  color: ${({ theme }) => theme.colors.textColorLight};
  gap: 10px;
`

export const StageColor = styled.span<{ stage: StageTypes }>`
  --dimensions: 10px;

  align-items: center;
  background-color: ${({ stage, theme: { stages } }) => stages[stage] ?? '#fff'};
  border-radius: 50%;
  color: ${({ theme }) => theme.colors.textColor};
  display: flex;
  flex-grow: 0;
  flex-shrink: 0;
  height: var(--dimensions);
  margin-top: -2px;
  width: var(--dimensions);
`

export const Stage: React.FC<{
  stage: StageTypes
}> = ({ children, stage, ...restProps }) => {
  return (
    <Wrapper {...restProps}>
      <StageColor stage={stage} /> {children}
    </Wrapper>
  )
}
