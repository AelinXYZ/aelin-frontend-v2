import React from 'react'
import styled from 'styled-components'

const Wrapper = styled.svg`
  .fill {
    fill: ${({ theme: { colors } }) => colors.textColor};
  }
`

export const Sent: React.FC<{ className?: string }> = (props) => (
  <Wrapper
    className={`sent ${props.className}`}
    fill="none"
    height="37"
    viewBox="0 0 36 37"
    width="36"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <circle cx="4" cy="4.5" fill="white" fillOpacity="0.5" r="4" />
    <circle cx="18" cy="4.5" fill="white" fillOpacity="0.75" r="4" />
    <circle cx="32" cy="4.5" fill="white" r="4" />
    <circle cx="4" cy="18.5" fill="white" fillOpacity="0.75" r="4" />
    <circle cx="18" cy="18.5" fill="white" r="4" />
    <circle cx="32" cy="18.5" fill="white" fillOpacity="0.75" r="4" />
    <circle cx="4" cy="32.5" fill="white" r="4" />
    <circle cx="18" cy="32.5" fill="white" fillOpacity="0.75" r="4" />
    <circle cx="32" cy="32.5" fill="white" fillOpacity="0.5" r="4" />
  </Wrapper>
)
