import React from 'react'

import CollapsibleBlock from '@/src/components/common/CollapsibleBlock'
import AelinData from '@/src/components/sidebar/AelinData'
import BuyAelin from '@/src/components/sidebar/BuyAelin'
import { Chains } from '@/src/constants/chains'
import { useWeb3Connection } from '@/src/providers/web3ConnectionProvider'

const Aelin = ({ ...restProps }) => {
  const { appChainId } = useWeb3Connection()

  return (
    <CollapsibleBlock name="aelin" title={'Aelin'} {...restProps}>
      {appChainId !== Chains.arbitrum && appChainId !== Chains.polygon && <AelinData />}
      <BuyAelin />
    </CollapsibleBlock>
  )
}

export default Aelin
