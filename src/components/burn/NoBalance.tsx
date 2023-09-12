import { Contents, Wrapper } from '../pools/actions/Wrapper'
import { genericSuspense } from '@/src/components/helpers/SafeSuspense'

const NoBalance: React.FC = () => {
  return (
    <Wrapper title={`No AELIN balance`}>
      <Contents>
        You must have AELIN tokens in the connected wallet to retrieve your share of treasury
        assets.
      </Contents>
    </Wrapper>
  )
}

export default genericSuspense(NoBalance)
