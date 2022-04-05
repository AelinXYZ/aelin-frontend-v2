import styled from 'styled-components'

import { StepCircle } from '@/src/components/timeline/StepCircle'

const Wrapper = styled.div`
  align-items: center;
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
  width: 80px;
`

const Text = styled.div<{ isActive?: boolean; isDone?: boolean }>`
  color: ${({ isActive, isDone, theme: { colors } }) =>
    isActive ? colors.primary : isDone ? colors.textColor : 'rgba(255, 255, 255, 0.4)'};
  font-family: ${({ theme }) => theme.fonts.fontFamilyTitle};
  font-size: 1.2rem;
  font-weight: 600;
  line-height: 1.3;
  padding: 6px 15px 0;
  text-align: center;
`

export const Step: React.FC<{ isActive?: boolean; isDone?: boolean }> = ({
  children,
  isActive,
  isDone,
  ...restProps
}) => {
  return (
    <Wrapper {...restProps}>
      <StepCircle isActive={isActive || isDone} />
      <Text isActive={isActive} isDone={isDone}>
        {children}
      </Text>
    </Wrapper>
  )
}
