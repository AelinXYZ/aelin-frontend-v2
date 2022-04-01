import { ChangeEvent, useEffect, useRef, useState } from 'react'

export interface Duration {
  days: number | undefined
  hours: number | undefined
  minutes: number | undefined
}

interface InputDeadlineProps {
  defaultValue?: Duration
  onChange: (duration: Duration) => void
}

enum durationTypes {
  days = 'days',
  hours = 'hours',
  minutes = 'minutes',
}

export const DeadlineInput = ({
  defaultValue = { days: undefined, hours: undefined, minutes: undefined },
  onChange,
}: InputDeadlineProps) => {
  const [duration, setDuration] = useState(defaultValue)
  // prevent rendering loop using onChange prop as ref
  const { current: onChangeFromProps } = useRef(onChange)

  const handleSetDuration = (e: ChangeEvent<HTMLInputElement>, type: durationTypes) => {
    const { value } = e.target

    setDuration({ ...duration, [type]: Number(value) })
  }

  useEffect(() => {
    onChangeFromProps(duration)
  }, [duration, onChangeFromProps])

  return (
    <>
      <input
        defaultValue={duration?.days}
        id="durationDays"
        name="durationDays"
        onChange={(e) => handleSetDuration(e, durationTypes.days)}
        placeholder="Days"
        type="number"
      />
      <input
        defaultValue={duration?.hours}
        id="durationHours"
        name="durationHours"
        onChange={(e) => handleSetDuration(e, durationTypes.hours)}
        placeholder="Hours"
        type="number"
      />
      <input
        defaultValue={duration?.minutes}
        id="durationMinutes"
        name="durationMinutes"
        onChange={(e) => handleSetDuration(e, durationTypes.minutes)}
        placeholder="Mins"
        type="number"
      />
    </>
  )
}
