import React from 'react'
import styled from 'styled-components'

const Wrapper = styled.svg`
  .fill {
    fill: ${({ theme: { collapsibleBlock } }) => collapsibleBlock.buttonColor};
  }
`

export const ArrowUp: React.FC<{ className?: string }> = (props) => (
  <Wrapper
    className={`arrowUp ${props.className}`}
    fill="none"
    height="7"
    viewBox="0 0 10 8"
    width="18"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      className="fill"
      d="M6.52539 0.947262C6.30078 0.947262 6.11523 1.03027 5.93945 1.21093L1.20312 6.10351C1.06152 6.24511 0.988281 6.42089 0.988281 6.62109C0.988281 7.03613 1.31543 7.36328 1.72559 7.36328C1.93555 7.36328 2.11621 7.28027 2.26269 7.13379L6.53027 2.70996L10.793 7.13379C10.9346 7.28027 11.125 7.36328 11.3252 7.36328C11.7354 7.36328 12.0625 7.03613 12.0625 6.62109C12.0625 6.41601 11.9941 6.24511 11.8525 6.10351L7.11133 1.21093C6.93555 1.03027 6.75488 0.947262 6.52539 0.947262Z"
    />
  </Wrapper>
)
