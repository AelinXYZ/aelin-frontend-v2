import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import styled from 'styled-components'

import { Step as BaseStep } from '@/src/components/steps/Step'

const STEP_WIDTH = 98

const Wrapper = styled.div`
  --step-width: ${STEP_WIDTH}px;

  margin: 20px auto 40px;
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
    background-color: ${({ theme }) => theme.steps.lineBackgroundColor};
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
  currentStepOrder: number
  data: { title: string; isActive: boolean }[]
  direction: 'next' | 'prev' | undefined
}

export const StepIndicator: React.FC<Props> = ({
  currentStepOrder,
  data,
  direction,
  ...restProps
}) => {
  const wrapperRef = useRef<HTMLDivElement>(null)
  const [wrapperWidth, setWrapperWidth] = useState(0)
  const [xScroll, setXScroll] = useState(0)

  const currentElementLeftX = useMemo(
    () => currentStepOrder * STEP_WIDTH - STEP_WIDTH,
    [currentStepOrder],
  )
  const currentElementRightX = useMemo(() => currentStepOrder * STEP_WIDTH, [currentStepOrder])
  const leftIsOutOfBounds = useMemo(
    () => xScroll + currentElementLeftX < 0,
    [currentElementLeftX, xScroll],
  )
  const rightIsOutOfBounds = useMemo(
    () => currentElementRightX - xScroll > wrapperWidth,
    [currentElementRightX, wrapperWidth, xScroll],
  )
  const xScrollToGetRightElementIntoView = useMemo(
    () => -(currentElementRightX - wrapperWidth),
    [currentElementRightX, wrapperWidth],
  )
  const xScrollToGetLeftElementIntoView = useMemo(() => -currentElementLeftX, [currentElementLeftX])

  const updateXScroll = useCallback(() => {
    if (rightIsOutOfBounds && direction === 'next') {
      setXScroll(xScrollToGetRightElementIntoView)
    }
    if (leftIsOutOfBounds && direction === 'prev') {
      setXScroll(xScrollToGetLeftElementIntoView)
    }
  }, [
    direction,
    leftIsOutOfBounds,
    rightIsOutOfBounds,
    xScrollToGetLeftElementIntoView,
    xScrollToGetRightElementIntoView,
  ])

  useEffect(() => {
    setWrapperWidth(wrapperRef.current?.clientWidth || 0)
    updateXScroll()

    window.addEventListener('resize', function () {
      setWrapperWidth(wrapperRef.current?.clientWidth || 0)
    })
  }, [updateXScroll])

  return (
    <Wrapper ref={wrapperRef} {...restProps}>
      <ScrollableWrapper style={{ left: `${xScroll}px` }}>
        {data.map(({ isActive, title }, index) => (
          <Step isActive={isActive} isDone={index + 1 < currentStepOrder} key={index}>
            {title}
          </Step>
        ))}
      </ScrollableWrapper>
    </Wrapper>
  )
}
