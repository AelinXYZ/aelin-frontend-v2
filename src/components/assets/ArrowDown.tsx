import React from 'react'
import styled from 'styled-components'

const Wrapper = styled.svg`
  .fill {
    fill: ${({ theme: { collapsibleBlock } }) => collapsibleBlock.buttonColor};
  }
`

export const ArrowDown: React.FC<{ className?: string }> = (props) => (
  <Wrapper
    className={`arrowDown ${props.className}`}
    fill="none"
    height="7"
    viewBox="0 0 10 8"
    width="18"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      className="fill"
      d="M6.47461 6.55274C6.69922 6.55274 6.88477 6.46973 7.06055 6.28906L11.7969 1.39649C11.9385 1.25489 12.0117 1.0791 12.0117 0.878909C12.0117 0.463869 11.6846 0.136721 11.2744 0.136721C11.0645 0.136721 10.8838 0.219729 10.7373 0.366213L6.46973 4.79004L2.20703 0.366213C2.06543 0.219728 1.875 0.13672 1.6748 0.13672C1.26465 0.13672 0.9375 0.463869 0.9375 0.878908C0.9375 1.08399 1.00586 1.25488 1.14746 1.39649L5.88867 6.28906C6.06445 6.46973 6.24512 6.55274 6.47461 6.55274Z"
    />
  </Wrapper>
)
