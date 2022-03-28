import React, { useState } from 'react'
import styled from 'styled-components'

import useCollapse from 'react-collapsed'

import { ArrowDown } from '@/src/components/assets/ArrowDown'
import { ArrowUp } from '@/src/components/assets/ArrowUp'
import GraphComponent from '@/src/components/collapsContent/GraphComponent'
import { GradientButton, RoundedButton } from '@/src/components/pureStyledComponents/buttons/Button'

const Wrapper = styled.div`
  color: ${({ theme: { colors } }) => colors.textColor};
  display: block;
  text-align: center;
  margin-top: 10px;
  border-top: 1px solid rgba(255, 255, 255, 0.25);
  padding-top: 20px;
  @media (max-width: ${({ theme }) => theme.themeBreakPoints.desktopStart}) {
    background-color: ${(props) => props.theme.card.backgroundColor};
    border-radius: ${({ theme }) => theme.card.borderRadius};
    border: ${(props) => props.theme.card.borderColor};
    padding: 20px;
    margin: 10px 0 10px 10px;
  }
  @media (max-width: ${({ theme }) => theme.themeBreakPoints.tabletPortraitStart}) {
    margin: 10px;
    padding-bottom: 0;
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

const Text = styled.p`
  color: #babcc1;
  margin: 0 0 0.3em 0;
  text-align: left;
`
const Numbers = styled.span`
  color: #3dc0f1;
`

const Title = styled.h3`
  font-size: 1.8rem;
  margin: 0;
  padding: 0;
  font-weight: 700;
  font-family: ${({ theme }) => theme.fonts.fontFamilyTitle};
`

const Aelin = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  @media (max-width: ${({ theme }) => theme.themeBreakPoints.tabletPortraitStart}) {
    margin: 0 0 20px 0;
  }
`

const GradientButtonClaim = styled(GradientButton)`
  margin: 1.2em auto 0;
  @media (max-width: ${({ theme }) => theme.themeBreakPoints.desktopStart}) {
    margin: 1em 0 0 0;
  }
  @media (max-width: ${({ theme }) => theme.themeBreakPoints.tabletPortraitStart}) {
    margin: 1em auto;
  }
`

const AelinFunc: React.FC = ({ ...restProps }) => {
  const [isExpanded, setExpanded] = useState(false)
  const { getCollapseProps, getToggleProps } = useCollapse({ isExpanded })
  return (
    <Wrapper {...restProps}>
      <Aelin>
        <Title>Aelin</Title>

        <CollapseBtn
          {...getToggleProps({
            onClick: () => setExpanded((prevExpanded) => !prevExpanded),
          })}
        >
          {isExpanded ? <ArrowUp /> : <ArrowDown />}
        </CollapseBtn>
      </Aelin>

      <section {...getCollapseProps()}>
        <Text>
          Aelin balance: <Numbers> 0.0211231</Numbers>
        </Text>
        <Text>
          Aelin balance: <Numbers> 0.0211231</Numbers>
        </Text>
        <Text>
          Aelin balance: <Numbers> 0.0211231</Numbers>
        </Text>
        {/* TODO: array data */}

        <GradientButtonClaim>Claim</GradientButtonClaim>
        <GraphComponent />
        <GradientButtonClaim>Buy Aelins</GradientButtonClaim>
      </section>
    </Wrapper>
  )
}

export default AelinFunc
