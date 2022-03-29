import React from 'react'
import styled from 'styled-components'

import { GradientButton } from '@/src/components/pureStyledComponents/buttons/Button'
import AelinDataRow from '@/src/components/sidebar/AelinDataRow'
import CollapsibleBlock from '@/src/components/sidebar/CollapsibleBlock'
import Graph from '@/src/components/sidebar/Graph'

const DataRows = styled.div`
  margin-bottom: 20px;
`

const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 40px;
`

const Aelin = ({ ...restProps }) => {
  return (
    <CollapsibleBlock title={'Aelin'} {...restProps}>
      <DataRows>
        <AelinDataRow label={'Aelin balance:'} value={0.25465487} />
        <AelinDataRow label={'Aelin staking:'} value={1.7548656} />
        <AelinDataRow label={'My rewards:'} value={0.0005468} />
      </DataRows>
      <ButtonContainer>
        <GradientButton>Claim</GradientButton>
      </ButtonContainer>
      <Graph />
    </CollapsibleBlock>
  )
}

export default Aelin
