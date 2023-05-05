import React from 'react'

import CollapsibleBlock from '@/src/components/common/CollapsibleBlock'
import BuyAelin from '@/src/components/sidebar/BuyAelin'

const Aelin = ({ ...restProps }) => (
  <CollapsibleBlock name="aelin" title={'Aelin'} {...restProps}>
    <BuyAelin />
  </CollapsibleBlock>
)

export default Aelin
