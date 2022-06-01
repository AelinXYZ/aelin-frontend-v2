import { Contents, Wrapper } from '@/src/components/pools/actions/Wrapper'

function NothingToClaim() {
  return (
    <Wrapper title={`Nothing to claim`}>
      <Contents>You have not participated in this pool</Contents>
    </Wrapper>
  )
}

export default NothingToClaim
