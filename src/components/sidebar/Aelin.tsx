import React from 'react'

import AelinData from '@/src/components/sidebar/AelinData'
import BuyAelin from '@/src/components/sidebar/BuyAelin'
import CollapsibleBlock from '@/src/components/sidebar/CollapsibleBlock'

const Aelin = ({ ...restProps }) => {
  return (
    <CollapsibleBlock title={'Aelin'} {...restProps}>
      <AelinData />
      <BuyAelin />
    </CollapsibleBlock>
  )
}

export default Aelin
