import React from 'react'

import AelinData from '@/src/components/sidebar/AelinData'
import CollapsibleBlock from '@/src/components/sidebar/CollapsibleBlock'
import Graph from '@/src/components/sidebar/Graph'

const Aelin = ({ ...restProps }) => {
  return (
    <CollapsibleBlock name="aelin" title={'Aelin'} {...restProps}>
      <AelinData />
      <Graph />
    </CollapsibleBlock>
  )
}

export default Aelin
