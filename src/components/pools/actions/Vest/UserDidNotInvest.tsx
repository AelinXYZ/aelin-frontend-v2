import { Contents, Wrapper } from '@/src/components/pools/actions/Wrapper'

function UserDidNotInvest() {
  return (
    <Wrapper title={`You didn't invest`}>
      <Contents>Nothing to claim. You haven't participated in this pool</Contents>
    </Wrapper>
  )
}

export default UserDidNotInvest
