import { ReactNode } from 'react'
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
  border: 1px solid
    ${({ stage, theme: { stages } }) =>
      stage === 'complete' ? 'rgba(71, 87, 97, 0.5)' : stages[stage]};
  border-radius: 50%;
  color: ${({ theme }) => theme.colors.textColor};
  display: flex;
  flex-grow: 0;
  flex-shrink: 0;
  height: var(--dimensions);
  margin-top: -2px;
  width: var(--dimensions);
`

type StageProps = {
  children: ReactNode
  stage: StageTypes
}

export const Stage = ({ children, stage }: StageProps) => {
  return (
    <Wrapper>
      <StageColor stage={stage.toLowerCase()} /> {children}
    </Wrapper>
  )
}
