import { ChangeEvent, useEffect, useRef, useState } from 'react'
import styled from 'styled-components'

import { LabeledCheckbox } from '@/src/components/form/LabeledCheckbox'
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

const Checkbox = styled(LabeledCheckbox)`
  margin: 20px auto 0;
  width: fit-content;
`

interface InputDeadlineProps {
  defaultValue?: Duration
  onChange: (duration: Duration) => void
  inputNames?: string[]
  autofocusOnRender?: boolean
  disabled?: boolean
  emptyCheckbox?: boolean
  emptyCheckboxLabel?: string
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
  emptyCheckbox,
  emptyCheckboxLabel = 'No value',
  ...restProps
}: InputDeadlineProps) => {
  const [duration, setDuration] = useState(defaultValue)
  const [emptyValue, setEmptyValue] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleSetDuration = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    const newDuration = { ...duration, [name]: value ? Number(value) : undefined }
    if (value.length > MAX_LENGTH || Number(value) < 0) {
      e.preventDefault()
    } else {
      setDuration(newDuration)
      onChange(newDuration)
    }
  }

  useEffect(() => {
    if (inputRef.current && autofocusOnRender) {
      inputRef.current?.focus()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (emptyCheckbox && Object.values(duration).every((v) => v === 0)) {
      setEmptyValue(true)
    }
  }, [duration, emptyCheckbox])

  return (
    <>
      <Grid {...restProps}>
        <Textfield
          data-cy="hmsInput-durationDays"
          disabled={emptyValue || disabled}
          id="durationDays"
          min="0"
          name={inputNames[0]}
          onChange={handleSetDuration}
          placeholder="Days"
          ref={inputRef}
          type="number"
          value={duration?.days ?? ''}
        />
        <Textfield
          data-cy="hmsInput-durationHours"
          disabled={emptyValue || disabled}
          id="durationHours"
          min="0"
          name={inputNames[1]}
          onChange={handleSetDuration}
          placeholder="Hours"
          type="number"
          value={duration?.hours ?? ''}
        />
        <Textfield
          data-cy="hmsInput-durationMinutes"
          disabled={emptyValue || disabled}
          id="durationMinutes"
          min="0"
          name={inputNames[2]}
          onChange={handleSetDuration}
          placeholder="Mins"
          type="number"
          value={duration?.minutes ?? ''}
        />
      </Grid>
      {emptyCheckbox && (
        <Checkbox
          checked={emptyValue}
          label={emptyCheckboxLabel}
          onClick={() => {
            const newValue = {
              days: emptyValue ? undefined : 0,
              hours: emptyValue ? undefined : 0,
              minutes: emptyValue ? undefined : 0,
            }
            setEmptyValue(!emptyValue)
            setDuration(newValue)
            onChange(newValue)
          }}
        />
      )}
    </>
  )
}
