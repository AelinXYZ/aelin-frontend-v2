import React from 'react'
import styled from 'styled-components'

import AelinNumbers from './AelinNumbers'
import CollapseComponents from './CollapseComponents'
import { GradientButton } from '@/src/components/pureStyledComponents/buttons/Button'
import GraphComponent from '@/src/components/sidebar/GraphComponent'

const GradientButtonClaim = styled(GradientButton)`
  margin: 1.2em auto 0;

  @media (max-width: ${({ theme }) => theme.themeBreakPoints.desktopStart}) {
    margin: 1em 0 0 0;
  }
  @media (max-width: ${({ theme }) => theme.themeBreakPoints.tabletPortraitStart}) {
    margin: 1em auto;
  }
`

const Aelin = ({ ...restProps }) => {
  return (
    <CollapseComponents title={'Aelin'} {...restProps}>
      <section>
        <AelinNumbers label={'Aelin balance:'} value={0.25465487} />
        <AelinNumbers label={'Aelin staking:'} value={1.7548656} />
        <AelinNumbers label={'My rewards:'} value={0.0005468} />
        <GradientButtonClaim>Claim</GradientButtonClaim>
        <GraphComponent />
        <GradientButtonClaim>Buy Aelins</GradientButtonClaim>
      </section>
    </CollapseComponents>
  )
}

export default Aelin
