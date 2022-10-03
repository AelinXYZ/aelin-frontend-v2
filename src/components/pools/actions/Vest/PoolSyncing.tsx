import styled from 'styled-components'

import { Contents as BaseContents, Wrapper } from '@/src/components/pools/actions/Wrapper'

const Contents = styled(BaseContents)`
  margin-bottom: 30px;
`
function PoolIsSyncing() {
  return (
    <Wrapper title={`Pool syncing`}>
      <Contents>Please wait until data has been indexed</Contents>
    </Wrapper>
  )
}

export default PoolIsSyncing
