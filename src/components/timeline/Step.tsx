import styled from 'styled-components'

import { StepCircle } from '@/src/components/timeline/StepCircle'

const Wrapper = styled.div`
  align-items: center;
  display: flex;
  flex-direction: column;
  width: 80px;
`

const Text = styled.div<{ isActive?: boolean }>`
  color: rgba(255, 255, 255, 0.4);
  font-family: ${({ theme }) => theme.fonts.fontFamilyTitle};
  font-size: 1.2rem;
  font-weight: 600;
  line-height: 1.3;
  padding-top: 6px;
  text-align: center;
`

export const Step: React.FC<{ isActive?: boolean }> = ({ children, isActive, ...restProps }) => {
  return (
    <Wrapper {...restProps}>
      <StepCircle isActive={isActive} />
      <Text isActive={isActive}>{children}</Text>
    </Wrapper>
  )
}
