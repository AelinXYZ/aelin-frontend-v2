import styled from 'styled-components'

import { StepCircleBig as BaseStepCircle } from '@/src/components/timeline/StepCircle'

const Wrapper = styled.div`
  --step-height: 86px;

  display: grid;
  grid-template-columns: 1fr;
  margin: 0 0 0 auto;
  position: relative;
  row-gap: 20px;
  width: 100%;

  &::before {
    content: '';
    background-color: rgba(255, 255, 255, 0.2);
    width: 4px;
    top: calc(var(--step-height) / 2);
    position: absolute;
    bottom: calc(var(--step-height) / 2);
    left: 16px;
    z-index: 10;
  }
`

const Item = styled.div`
  align-items: center;
  display: grid;
  grid-template-columns: 36px 1fr;
  column-gap: 20px;
`

const Info = styled.div`
  background: ${({ theme: { colors } }) => colors.componentBackgroundColor};
  border-radius: 8px;
  border: 1px solid ${({ theme: { colors } }) => colors.borderColor};
  padding: 20px;
`

const Title = styled.h4`
  color: ${({ theme }) => theme.colors.textColor};
  font-family: ${({ theme }) => theme.fonts.fontFamilyTitle};
  font-size: 1.4rem;
  font-weight: 600;
  line-height: 1.2;
  margin: 0 0 4px;
`

const Value = styled.p`
  color: ${({ theme }) => theme.colors.textColorLight};
  font-size: 1.4rem;
  font-weight: 400;
  line-height: 1.3;
  margin: 0;
`

const StepCircleBig = styled(BaseStepCircle)``

export const Timeline: React.FC<{ activeItem?: number }> = ({ activeItem, ...restProps }) => {
  return (
    <Wrapper {...restProps}>
      <Item>
        <StepCircleBig />
        <Info>
          <Title>Pool Creation</Title>
          <Value>Jan 1, 2022, 10.00AM</Value>
        </Info>
      </Item>
      <Item>
        <StepCircleBig />
        <Info>
          <Title>Pool Creation</Title>
          <Value>Jan 1, 2022, 10.00AM</Value>
        </Info>
      </Item>
    </Wrapper>
  )
}
