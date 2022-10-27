// Guard to check if var is Duration type
import { Duration } from 'date-fns'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function isDuration(duration: any): duration is Duration {
  return (
    typeof duration === 'object' &&
    'days' in duration &&
    'hours' in duration &&
    'minutes' in duration
  )
}
