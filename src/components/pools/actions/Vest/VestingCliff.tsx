import styled from 'styled-components'

import { Deadline as BaseDeadline } from '@/src/components/common/Deadline'
import { Contents, Wrapper } from '@/src/components/pools/actions/Wrapper'
import { calculateDeadlineProgress } from '@/src/utils/aelinPoolUtils'
import { DATE_DETAILED, formatDate } from '@/src/utils/date'

const Deadline = styled(BaseDeadline)`
  margin-right: auto;
`

const NoMarginContents = styled(Contents)`
  margin: 0;
`

type VestingCliffProps = {
  redemptionEnds: Date | undefined | null
  vestingCliffEnds: Date | undefined | null
}

function VestingCliff({ redemptionEnds, vestingCliffEnds }: VestingCliffProps) {
  return (
    <Wrapper title={'Vesting Cliff'}>
      <Contents>
        Wait for the vesting cliff to end before being able to vest your deal tokens
      </Contents>
      <Deadline
        progress={calculateDeadlineProgress(vestingCliffEnds as Date, redemptionEnds as Date)}
      >
        <NoMarginContents>{formatDate(vestingCliffEnds as Date, DATE_DETAILED)}</NoMarginContents>
      </Deadline>
    </Wrapper>
  )
}

export default VestingCliff
