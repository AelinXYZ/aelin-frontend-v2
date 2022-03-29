import React, { useState } from 'react'
import styled from 'styled-components'

import CollapsibleBlock from './CollapsibleBlock'
import Pool from './Pool'
import { TabButton } from '@/src/components/pureStyledComponents/buttons/Button'

const Filters = styled.div`
  display: flex;
  gap: 6px;
  justify-content: space-between;
  margin-bottom: 20px;
`

const MoreButton = styled(TabButton)`
  border-color: ${({ theme: { colors } }) => colors.textColor};
  color: ${({ theme: { colors } }) => colors.textColor};
`

const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  padding: 5px 0 0 0;
`

const MyPools: React.FC = ({ ...restProps }) => {
  const [activeFilter, setActiveFilter] = useState<'invested' | 'sponsored' | 'funded' | undefined>(
    'invested',
  )

  return (
    <CollapsibleBlock title={'My pools'} {...restProps}>
      <Filters>
        <TabButton
          isActive={activeFilter === 'invested'}
          onClick={() => {
            setActiveFilter('invested')
          }}
        >
          Invested (4)
        </TabButton>
        <TabButton
          isActive={activeFilter === 'sponsored'}
          onClick={() => {
            setActiveFilter('sponsored')
          }}
        >
          Sponsored (0)
        </TabButton>
        <TabButton
          isActive={activeFilter === 'funded'}
          onClick={() => {
            setActiveFilter('funded')
          }}
        >
          Funded (0)
        </TabButton>
      </Filters>
      <Pool color={'green'}>Kwenta DAO</Pool>
      <Pool color={'yellow'} notifications={1}>
        Nukevaults.com
      </Pool>
      <Pool color={'blue'}>Sheldon.1</Pool>
      <ButtonContainer>
        <MoreButton>See more</MoreButton>
      </ButtonContainer>
    </CollapsibleBlock>
  )
}

export default MyPools
