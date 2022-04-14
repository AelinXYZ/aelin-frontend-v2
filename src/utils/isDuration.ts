// Guard to check if var is Duration type
import { Duration } from 'date-fns'

import { Token } from '@/src/constants/token'

export function isDuration(
  duration: string | number | Token | Duration | undefined,
): duration is Duration {
  return (
    typeof duration === 'object' &&
    'days' in duration &&
    'hours' in duration &&
    'minutes' in duration
  )
}
