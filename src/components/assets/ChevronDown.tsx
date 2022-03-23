import React from 'react'
import styled from 'styled-components'

const Wrapper = styled.svg`
  .fill {
    fill: ${({ theme: { colors } }) => colors.textColor};
  }
`

export const ChevronDown: React.FC<{ className?: string }> = (props) => (
  <Wrapper
    className={`chevronDown ${props.className}`}
    fill="none"
    height="8"
    viewBox="0 0 10 8"
    width="10"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path className="fill" d="M5 8L0.669873 0.5L9.33013 0.500001L5 8Z" />
  </Wrapper>
)
