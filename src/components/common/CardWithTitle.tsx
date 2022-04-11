import styled from 'styled-components'

import { BaseCard } from '@/src/components/pureStyledComponents/common/BaseCard'

const Wrapper = styled(BaseCard)`
  padding: 0;
`

const Title = styled.h2`
  align-items: center;
  background: linear-gradient(
    90deg,
    ${({ theme }) => theme.colors.gradientStart} 9.37%,
    ${({ theme }) => theme.colors.gradientEnd} 100%
  );
  border-top-left-radius: ${({ theme: { card } }) => card.borderRadius};
  border-top-right-radius: ${({ theme: { card } }) => card.borderRadius};
  color: ${({ theme }) => theme.colors.textColor};
  display: flex;
  font-size: 1.6rem;
  font-weight: 600;
  justify-content: center;
  line-height: 1.4;
  margin: 0;
  min-height: 50px;
  padding: 0 20px;
  text-align: center;
`

const Inner = styled.div`
  align-items: center;
  display: flex;
  flex-direction: column;
  padding: 20px 45px 40px;
`

export const CardWithTitle: React.FC<{ title: string }> = ({ children, title, ...restProps }) => (
  <Wrapper {...restProps}>
    <Title>{title}</Title>
    <Inner className="cardWithTitleInner">{children}</Inner>
  </Wrapper>
)
