import { Deadline } from '@/src/components/common/Deadline'
import { Contents, Wrapper } from '@/src/components/pools/actions/Wrapper'
import { calculateDeadlineProgress } from '@/src/utils/aelinPoolUtils'
import { DATE_DETAILED, formatDate } from '@/src/utils/date'

type VestingCliffProps = {
  redemtionEnds: Date | undefined
  vestingCliffEnds: Date | undefined | null
}

function VestingCliff({ redemtionEnds, vestingCliffEnds }: VestingCliffProps) {
  return (
    <Wrapper title={'Vesting Cliff'}>
      <Contents>
        Wait for the vesting cliff to end before being able to vest your deal tokens
      </Contents>
      <Deadline
        progress={calculateDeadlineProgress(vestingCliffEnds as Date, redemtionEnds as Date)}
        width="180px"
      >
        <Contents>{formatDate(vestingCliffEnds as Date, DATE_DETAILED)}</Contents>
      </Deadline>
    </Wrapper>
  )
}

export default VestingCliff
