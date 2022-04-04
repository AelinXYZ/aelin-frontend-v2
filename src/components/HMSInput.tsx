import { ChangeEvent, useEffect, useState } from 'react'

interface InputDeadlineProps {
  defaultValue?: Duration
  onChange: (duration: Duration) => void
  inputNames?: string[]
}

enum durationTypes {
  days = 'days',
  hours = 'hours',
  minutes = 'minutes',
}

export const HMSInput = ({
  defaultValue = { days: undefined, hours: undefined, minutes: undefined },
  onChange,
  inputNames = [durationTypes.days, durationTypes.hours, durationTypes.minutes],
}: InputDeadlineProps) => {
  const [duration, setDuration] = useState(defaultValue)

  const handleSetDuration = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target

    setDuration({ ...duration, [name]: Number(value) })
  }

  useEffect(() => {
    onChange(duration)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [duration])

  return (
    <>
      <input
        defaultValue={duration?.days}
        id="durationDays"
        min={0}
        name={inputNames[0]}
        onChange={handleSetDuration}
        placeholder="Days"
        type="number"
      />
      <input
        defaultValue={duration?.hours}
        id="durationHours"
        name={inputNames[1]}
        onChange={handleSetDuration}
        placeholder="Hours"
        type="number"
      />
      <input
        defaultValue={duration?.minutes}
        id="durationMinutes"
        name={inputNames[2]}
        onChange={handleSetDuration}
        placeholder="Mins"
        type="number"
      />
    </>
  )
}
