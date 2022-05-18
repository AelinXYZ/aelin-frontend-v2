import { ChangeEvent, useEffect, useRef, useState } from 'react'
import styled from 'styled-components'

import { Textfield } from '@/src/components/pureStyledComponents/form/Textfield'

const Grid = styled.div`
  display: grid;
  gap: 8px;
  max-width: 100%;

  @media (min-width: ${({ theme }) => theme.themeBreakPoints.tabletPortraitStart}) {
    grid-template-columns: 1fr 1fr 1fr;
    width: 376px;
  }
`

interface InputDeadlineProps {
  defaultValue?: Duration
  onChange: (duration: Duration) => void
  inputNames?: string[]
  autofocusOnRender?: boolean
  disabled?: boolean
}

enum durationTypes {
  days = 'days',
  hours = 'hours',
  minutes = 'minutes',
}
const MAX_LENGTH = 6
export const HMSInput = ({
  defaultValue = { days: undefined, hours: undefined, minutes: undefined },
  onChange,
  inputNames = [durationTypes.days, durationTypes.hours, durationTypes.minutes],
  autofocusOnRender,
  disabled = false,
  ...restProps
}: InputDeadlineProps) => {
  const [duration, setDuration] = useState(defaultValue)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleSetDuration = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    if (value.length > MAX_LENGTH) {
      e.preventDefault()
    } else {
      setDuration({ ...duration, [name]: value ? Number(value) : undefined })
    }
  }

  useEffect(() => {
    if (inputRef.current && autofocusOnRender) {
      inputRef.current?.focus()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    onChange(duration)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [duration])

  return (
    <Grid {...restProps}>
      <Textfield
        defaultValue={duration?.days}
        disabled={disabled}
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
        disabled={disabled}
        id="durationHours"
        name={inputNames[1]}
        onChange={handleSetDuration}
        placeholder="Hours"
        type="number"
      />
      <Textfield
        defaultValue={duration?.minutes}
        disabled={disabled}
        id="durationMinutes"
        name={inputNames[2]}
        onChange={handleSetDuration}
        placeholder="Mins"
        type="number"
      />
    </Grid>
  )
}
