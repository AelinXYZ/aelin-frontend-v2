import { useEffect, useState } from 'react'

import isAfter from 'date-fns/isAfter'
import ms from 'ms'

import { Deadline } from '@/src/components/common/Deadline'
import { Value } from '@/src/components/pools/common/InfoCell'
import { calculateDeadlineProgress } from '@/src/utils/aelinPoolUtils'

type DynamicDeadlineProps = {
  deadline: Date
  hideWhenDeadlineIsReached?: boolean
  start: Date
  width?: string
}

export const DynamicDeadline: React.FC<DynamicDeadlineProps> = ({
  children,
  deadline,
  hideWhenDeadlineIsReached,
  start,
  width,
}) => {
  const now = new Date()

  const [progress, setProgress] = useState(() =>
    isAfter(now, start) ? calculateDeadlineProgress(deadline, start) : '0',
  )

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date()

      const isAlreadyStarted = isAfter(now, start)

      if (!isAlreadyStarted) return

      const p = calculateDeadlineProgress(deadline, start)

      setProgress(p)
    }, ms('5s'))

    return () => clearInterval(interval)
  }, [deadline, start])

  const isEnded = Number(progress) === 0

  if (isEnded && hideWhenDeadlineIsReached) return <Value>Ended {children}</Value>

  return (
    <Deadline progress={progress} width={width}>
      {!isEnded ? <Value>{`Ends ${children}`}</Value> : 'Ended'}
    </Deadline>
  )
}
