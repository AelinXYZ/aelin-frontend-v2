import styled from 'styled-components'

import { Contents as BaseContents, Wrapper } from '@/src/components/pools/actions/Wrapper'

const Line = styled.div`
  border-bottom: 1px solid ${({ theme }) => theme.infoCell.borderBottomColor};
  margin-bottom: 30px;
  width: 100%;
`
const Contents = styled(BaseContents)`
  margin-bottom: 30px;
`
function HasTokensToClaim({ showLine }: { showLine: boolean }) {
  return (
    <Wrapper title={`Settle tokens`}>
      <Contents>Settle your allocation before you can vest your tokens.</Contents>
      {showLine && <Line />}
    </Wrapper>
  )
}

export default HasTokensToClaim
