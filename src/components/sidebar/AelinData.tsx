import styled from 'styled-components'

import { GradientButton } from '@/src/components/pureStyledComponents/buttons/Button'

const Wrapper = styled.div`
  margin-bottom: 40px;
`

const Rows = styled.div`
  margin-bottom: 20px;
`

const Row = styled.div`
  color: ${({ theme }) => theme.colors.textColorLight};
  font-size: 1.4rem;
  font-weight: 400;
  line-height: 1.2;
  margin: 0 0 8px 0;

  &:last-child {
    margin-bottom: 0;
  }
`

const Value = styled.span`
  color: ${({ theme }) => theme.colors.primary};
`

const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
`

const AelinData: React.FC = ({ ...restProps }) => {
  const data = [
    {
      title: 'Aelin balance:',
      value: '0.25465487',
    },
    {
      title: 'Aelin staking:',
      value: '1.7548656',
    },
    {
      title: 'My rewards:',
      value: '0.0005468',
    },
  ]

  return (
    <Wrapper {...restProps}>
      <Rows>
        {data.map(({ title, value }, index) => (
          <Row key={index}>
            {title} <Value>{value}</Value>
          </Row>
        ))}
      </Rows>
      <ButtonContainer>
        <GradientButton>Claim</GradientButton>
      </ButtonContainer>
    </Wrapper>
  )
}

export default AelinData
