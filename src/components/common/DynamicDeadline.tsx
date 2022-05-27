import { useEffect, useState } from 'react'

import ms from 'ms'

import { Deadline } from '@/src/components/common/Deadline'
import { calculateDeadlineProgress } from '@/src/utils/aelinPoolUtils'

type Props = {
  deadline: Date
  start: Date
  width?: string
}

export const DynamicDeadline: React.FC<Props> = ({ deadline, start, width }: Props) => {
  const [progress, setProgress] = useState('0')

  useEffect(() => {
    const interval = setInterval(() => {
      const p = calculateDeadlineProgress(deadline, start)
      setProgress(p)
    }, ms('5s'))

    return () => clearInterval(interval)
  }, [deadline, start])

  return <Deadline progress={progress} width={width} />
}
