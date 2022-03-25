import React, { useState } from 'react'
import styled from 'styled-components'

import useCollapse from 'react-collapsed'

import { ArrowDown } from '@/src/components/assets/ArrowDown'
import { ArrowUp } from '@/src/components/assets/ArrowUp'
import { GradientButton, RoundedButton } from '@/src/components/pureStyledComponents/buttons/Button'

const ClaimSection = styled.div`
  color: #fff;
  margin-bottom: 0.5em;
  display: block;
  text-align: center;
  margin-top: 20px;
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
  }
  & h3 {
    text-align: left;
    color: ${({ theme: { colors } }) => colors.textColor};
  }
  & p {
    color: #babcc1;
    margin: 0 0 0.3em 0;
    text-align: left;
  }
  & span {
    color: #3dc0f1;
  }
  & h3 {
    margin: 0;
  }
  & a {
    width: 30px;
    height: 30px;
    display: flex;
    padding: 0;
    align-items: center;
    justify-content: center;
    background: rgba(255, 255, 255, 0.06);
    border-radius: 50%;
    border: none;
    & svg {
      margin: 0 0 0 -2px;
    }
  }
`

const Aelin = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5em;
  @media (max-width: ${({ theme }) => theme.themeBreakPoints.tabletPortraitStart}) {
    margin: 0;
  }
  & h3,
  & h4 {
    margin: 0;
    padding: 0;
  }
`

const RoundButton = styled(RoundedButton)`
  margin: 1.2em auto 0;
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

function AelinFunc() {
  const [isExpanded, setExpanded] = useState(false)
  const { getCollapseProps, getToggleProps } = useCollapse({ isExpanded })
  return (
    <ClaimSection>
      <Aelin>
        <h3>Aelin</h3>

        <a
          {...getToggleProps({
            onClick: () => setExpanded((prevExpanded) => !prevExpanded),
          })}
        >
          {isExpanded ? <ArrowUp /> : <ArrowDown />}
        </a>
      </Aelin>

      <section {...getCollapseProps()}>
        <p>
          Aelin balance: <span> 0.0211231</span>
        </p>
        <p>
          Aelin staking: <span> 0.056641231</span>
        </p>
        <p>
          My rewards: <span> 0.0002112666</span>
        </p>

        <GradientButtonClaim>Claim</GradientButtonClaim>
      </section>
    </ClaimSection>
  )
}

export default AelinFunc
