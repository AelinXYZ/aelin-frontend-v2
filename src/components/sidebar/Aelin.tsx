import React from 'react'

import CollapsibleBlock from '@/src/components/common/CollapsibleBlock'
import AelinData from '@/src/components/sidebar/AelinData'
import BuyAelin from '@/src/components/sidebar/BuyAelin'

const Aelin = ({ ...restProps }) => {
  return (
    <CollapsibleBlock name="aelin" title={'Aelin'} {...restProps}>
      <AelinData />
      <BuyAelin />
    </CollapsibleBlock>
  )
}

export default Aelin
