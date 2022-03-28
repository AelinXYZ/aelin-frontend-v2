import React, { useState } from 'react'
import styled from 'styled-components'

import CollapseComponents from './CollapseComponents'
import GraphComponent from '@/src/components/collapsContent/GraphComponent'
import { GradientButton } from '@/src/components/pureStyledComponents/buttons/Button'

const Text = styled.p`
  color: #babcc1;
  margin: 0 0 0.3em 0;
  text-align: left;
`
const Numbers = styled.span`
  color: #3dc0f1;
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

const AelinFunc = () => {
  return (
    <CollapseComponents title={'Aelin'}>
      <section>
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
    </CollapseComponents>
  )
}

export default AelinFunc
