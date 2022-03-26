import React, { useState } from 'react'
import styled from 'styled-components'

import useCollapse from 'react-collapsed'

import { ArrowDown } from '@/src/components/assets/ArrowDown'
import { ArrowUp } from '@/src/components/assets/ArrowUp'
import { NavLink } from '@/src/components/navigation/NavLink'
import { ButtonCSS, RoundedButton } from '@/src/components/pureStyledComponents/buttons/Button'
import { myPools } from '@/src/constants/myPools'

const MyPoolsCont = styled.div`
  @media (max-width: ${({ theme }) => theme.themeBreakPoints.desktopStart}) {
    margin-right: 20px;
    background-color: ${(props) => props.theme.card.backgroundColor};
    border-radius: ${({ theme }) => theme.card.borderRadius};
    border: ${(props) => props.theme.card.borderColor};
    padding: 20px;
    margin: 10px 10px 10px 0;
  }
  @media (max-width: ${({ theme }) => theme.themeBreakPoints.tabletPortraitStart}) {
    margin: 10px;
  }
`

const MyPools = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1em;
  @media (max-width: ${({ theme }) => theme.themeBreakPoints.tabletPortraitStart}) {
    margin: 0;
  }
`

const Title = styled.h3`
  font-size: 1.8rem;
  margin: 0;
  padding: 0;
  font-weight: 700;
  font-family: ${({ theme }) => theme.fonts.fontFamilyTitle};
`

const MyPoolsItems = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 1.5em;
  & a {
    font-size: 10px;
  }
  @media (max-width: ${({ theme }) => theme.themeBreakPoints.tabletPortraitStart}) {
    margin-top: 15px;
  }
`

const Item = styled(NavLink)`
  ${ButtonCSS}
  border-color: transparent;
  color: ${({ theme: { colors } }) => colors.textColor};
  height: 24px;
  &.active,
  &:hover {
    background-color: ${({ theme }) => theme.buttonPrimary.backgroundColor};
    border-color: ${({ theme }) => theme.buttonPrimary.borderColor};
    color: ${({ theme }) => theme.buttonPrimary.color};

    .fill {
      fill: ${({ theme }) => theme.buttonPrimary.borderColor};
    }
  }
`
const CollapseBtn = styled.p`
  width: 30px;
  height: 30px;
  display: flex;
  padding: 0;
  margin: 0;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.06);
  border-radius: 50%;
  border: none;
  & svg {
    margin: 0 0 0 -2px;
  }
`

const Invest = styled.a`
  display: flex;
  align-items: center;
  color: ${({ theme: { colors } }) => colors.textColor};
  background-color: rgba(255, 255, 255, 0.08);
  margin-bottom: 0.6em;
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
  margin: 1.2em auto 0;
`

const Section = styled.section`
  padding-bottom: 10px;
`

const Button = styled.button`
  padding-bottom: 10px;
`

const MyPoolsFunc = () => {
  const [isExpanded, setExpanded] = useState(false)
  const { getCollapseProps, getToggleProps } = useCollapse({ isExpanded })
  const buttons = ['btn1', 'btn2', 'btn3']

  return (
    <MyPoolsCont>
      <MyPools>
        <Title>My Pools</Title>
        <CollapseBtn
          {...getToggleProps({
            onClick: () => setExpanded((prevExpanded) => !prevExpanded),
          })}
        >
          {isExpanded ? <ArrowUp /> : <ArrowDown />}
        </CollapseBtn>
      </MyPools>

      <Section {...getCollapseProps()}>
        <MyPoolsItems>
          {/* TODO: buttons on / off */}

          {myPools.map(({ href, title }, index) => (
            <Item href={href} key={`my_pools_item_${index}`}>
              {title}
            </Item>
          ))}
        </MyPoolsItems>

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
      </Section>
    </MyPoolsCont>
  )
}

export default MyPoolsFunc
