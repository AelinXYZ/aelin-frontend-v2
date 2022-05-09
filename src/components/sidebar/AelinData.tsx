import { useState } from 'react'
import styled from 'styled-components'

import { Filters } from '../pureStyledComponents/common/Filters'
import { GradientButton } from '@/src/components/pureStyledComponents/buttons/Button'
import { TabButton } from '@/src/components/pureStyledComponents/buttons/Button'

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

enum Tab {
  Aelin = 'Aelin',
  EthAelin = 'EthAelin',
}

function getBalanceTitle(activeTab: Tab): string {
  switch (activeTab) {
    case Tab.Aelin:
      return 'Aelin balance:'
    case Tab.EthAelin:
      return 'ETH/Aelin balance:'
  }
}

const AelinData: React.FC = ({ ...restProps }) => {
  const [activeTab, setActiveTab] = useState<Tab>(Tab.Aelin)

  const data = [
    {
      title: getBalanceTitle(activeTab),
      value: '0.25465487',
    },
    {
      title: 'My stake:',
      value: '1.7548656',
    },
    {
      title: 'My rewards:',
      value: '0.0005468',
    },
  ]

  return (
    <Wrapper {...restProps}>
      <Filters justifyContent="flex-start">
        <TabButton
          isActive={activeTab === Tab.Aelin}
          onClick={() => {
            setActiveTab(Tab.Aelin)
          }}
        >
          Aelin
        </TabButton>
        <TabButton
          isActive={activeTab === Tab.EthAelin}
          onClick={() => {
            setActiveTab(Tab.EthAelin)
          }}
        >
          ETH/Aelin
        </TabButton>
      </Filters>
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
