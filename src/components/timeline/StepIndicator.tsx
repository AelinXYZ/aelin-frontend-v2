import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import styled from 'styled-components'

import { Step as BaseStep } from '@/src/components/timeline/Step'

const STEP_WIDTH = 98

const Wrapper = styled.div`
  --step-width: ${STEP_WIDTH}px;

  margin: 0 auto 40px;
  max-width: 100%;
  overflow: hidden;
  position: relative;
  width: fit-content;
`

const ScrollableWrapper = styled.div`
  display: flex;
  left: 0;
  position: relative;
  transition: left 0.25s ease-in-out;
`

const Step = styled(BaseStep)`
  position: relative;
  width: var(--step-width);
  z-index: 5;

  &::before,
  &::after {
    content: '';
    background-color: rgba(255, 255, 255, 0.2);
    height: 2px;
    position: absolute;
    top: 11px;
    transition: background-color 0.15s linear;
    z-index: 10;
  }

  &::before {
    left: 0;
    right: 50%;
  }

  &::after {
    content: '';
    left: 50%;
    right: 0;
  }

  &:first-child::before {
    display: none;
  }

  &:last-child::after {
    display: none;
  }

  &::before {
    background-color: ${({ isActive, isDone, theme: { colors } }) =>
      (isDone || isActive) && colors.primary};
  }

  &::after {
    background-color: ${({ isDone, theme: { colors } }) => isDone && colors.primary};
  }
`

interface Props {
  data: { title: string; isActive: boolean }[]
  currentStepOrder?: number
}

type Direction = 'forward' | 'backward' | undefined

export const StepIndicator: React.FC<Props> = ({ currentStepOrder = 0, data, ...restProps }) => {
  const [currentStep, setCurrentStep] = useState(1)
  const [direction, setDirection] = useState<Direction>(undefined)
  const wrapperRef = useRef<HTMLDivElement>(null)
  const wrapperWidth = wrapperRef.current?.clientWidth
  const currentElementRightX = useMemo(() => currentStepOrder * STEP_WIDTH, [currentStepOrder])
  const currentElementLeftX = useMemo(() => (currentStepOrder - 1) * STEP_WIDTH, [currentStepOrder])
  const [scrollLeft, setScrollLeft] = useState(0)
  const currentElementIsOutOfBounds = useMemo(
    () =>
      wrapperWidth && direction === 'forward'
        ? currentElementRightX > wrapperWidth
        : wrapperWidth && direction === 'backward'
        ? scrollLeft < 0 && currentElementLeftX + scrollLeft < 0
        : false,
    [currentElementLeftX, currentElementRightX, direction, scrollLeft, wrapperWidth],
  )

  const updateDirection = useCallback(
    (direction: Direction) => {
      setDirection(direction)
      setCurrentStep(currentStepOrder)
    },
    [currentStepOrder],
  )

  useEffect(() => {
    if (currentElementIsOutOfBounds) {
      wrapperWidth && direction === 'forward'
        ? setScrollLeft(-(currentElementRightX - wrapperWidth))
        : wrapperWidth && direction === 'backward'
        ? setScrollLeft(scrollLeft + (STEP_WIDTH - (scrollLeft + currentElementRightX)))
        : 0
    }

    if (currentStepOrder > currentStep) {
      updateDirection('forward')
    } else if (currentStepOrder < currentStep) {
      updateDirection('backward')
    }
  }, [
    currentElementIsOutOfBounds,
    currentElementLeftX,
    currentElementRightX,
    currentStep,
    currentStepOrder,
    direction,
    scrollLeft,
    updateDirection,
    wrapperWidth,
  ])

  return (
    <Wrapper ref={wrapperRef} {...restProps}>
      <ScrollableWrapper style={{ left: `${scrollLeft}px` }}>
        {data.map(({ isActive, title }, index) => (
          <Step isActive={isActive} isDone={index + 1 < currentStepOrder} key={index}>
            {title}
          </Step>
        ))}
      </ScrollableWrapper>
    </Wrapper>
  )
}
