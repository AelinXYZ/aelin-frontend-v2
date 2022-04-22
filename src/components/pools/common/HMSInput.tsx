import { ChangeEvent, useEffect, useRef, useState } from 'react'
import styled from 'styled-components'

import { Textfield } from '@/src/components/pureStyledComponents/form/Textfield'

const Grid = styled.div`
  display: grid;
  gap: 8px;
  grid-template-columns: 1fr 1fr 1fr;
  width: 376px;
`

interface InputDeadlineProps {
  defaultValue?: Duration
  onChange: (duration: Duration) => void
  inputNames?: string[]
  autofocusOnRender?: boolean
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
  autofocusOnRender,
  ...restProps
}: InputDeadlineProps) => {
  const [duration, setDuration] = useState(defaultValue)
  const firstRender = useRef(true)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleSetDuration = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setDuration({ ...duration, [name]: Number(value) })
  }

  useEffect(() => {
    // check if component first render
    if (firstRender.current) {
      firstRender.current = false
      if (inputRef.current && autofocusOnRender && firstRender) {
        inputRef.current?.focus()
      }
    }
  })

  useEffect(() => {
    onChange(duration)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [duration])

  return (
    <Grid {...restProps}>
      <Textfield
        defaultValue={duration?.days}
        id="durationDays"
        min={0}
        name={inputNames[0]}
        onChange={handleSetDuration}
        placeholder="Days"
        ref={inputRef}
        type="number"
      />
      <Textfield
        defaultValue={duration?.hours}
        id="durationHours"
        name={inputNames[1]}
        onChange={handleSetDuration}
        placeholder="Hours"
        type="number"
      />
      <Textfield
        defaultValue={duration?.minutes}
        id="durationMinutes"
        name={inputNames[2]}
        onChange={handleSetDuration}
        placeholder="Mins"
        type="number"
      />
    </Grid>
  )
}
