import React, { useState } from 'react'
import styled from 'styled-components'

import CollapseComponents from './CollapseComponents'
import { RoundedButton } from '@/src/components/pureStyledComponents/buttons/Button'

const MyPoolsItems = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
  & a {
    font-size: 1rem;
  }
  @media (max-width: ${({ theme }) => theme.themeBreakPoints.tabletPortraitStart}) {
    margin-top: 15px;
  }
`

const Invest = styled.a`
  display: flex;
  align-items: center;
  color: ${({ theme: { colors } }) => colors.textColor};
  background-color: rgba(255, 255, 255, 0.08);
  margin-bottom: 10px;
  border-radius: 8px;
  height: 36px;
`
const Color = styled.span`
  display: inline-block;
  width: 8px;
  height: 8px;
  border-radius: 5px;
  margin: 0 8px 0 14px;
`

const OrangeState = styled.span`
  display: inline-block;
  background-color: #f1c40f;
  width: 8px;
  height: 8px;
  border-radius: 5px;
  margin: 0 8px 0 14px;
`

const BlueState = styled.span`
  display: inline-block;
  background-color: #469fff;
  width: 8px;
  height: 8px;
  border-radius: 5px;
  margin: 0 8px 0 14px;
`
const RoundButton = styled(RoundedButton)`
  margin: 12px auto 20px;
`

const Button = styled(RoundButton)`
  font-size: 1rem;
  height: 24px;
  padding: 0 10px 0 10px;
  opacity: 0.7;
  margin: 0;
  transition: 0.7s;
  &.active {
    background-color: ${({ theme }) => theme.buttonPrimary.backgroundColor};
    border-color: ${({ theme }) => theme.buttonPrimary.borderColor};
    color: ${({ theme }) => theme.buttonPrimary.color};
  }
`

const MyPoolsFunc: React.FC = ({ ...restProps }) => {
  const menuItems = ['Invented (3)', 'Sponsored (9)', 'Funded (5)']
  const [activeButton, setActiveButton] = useState('')

  return (
    <CollapseComponents title={'My pools'}>
      <section>
        <MyPoolsItems>
          {menuItems.map((OnOffButton) => {
            return (
              <Button
                className={activeButton === OnOffButton ? 'active' : ''}
                key={OnOffButton}
                onClick={() => {
                  setActiveButton(OnOffButton)
                }}
              >
                {OnOffButton}
              </Button>
            )
          })}
        </MyPoolsItems>

        {/* TODO: invest component */}
        <Invest>
          <Color /> Kwenta DAO
        </Invest>
        <Invest>
          <Color /> Nukevaults.com
        </Invest>
        <Invest>
          <Color /> Sheldon.1
        </Invest>

        <RoundButton>See more</RoundButton>
      </section>
    </CollapseComponents>
  )
}

export default MyPoolsFunc
