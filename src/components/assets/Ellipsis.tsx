import React from 'react'
import styled from 'styled-components'

const Wrapper = styled.svg`
  .fill {
    fill: ${({ theme: { colors } }) => colors.textColor};
  }
`

export const Ellipsis: React.FC<{ className?: string }> = (props) => (
  <Wrapper
    className={`ellipsis ${props.className}`}
    fill="none"
    height="6"
    viewBox="0 0 26 6"
    width="26"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <circle className="fill" cx="23" cy="3" r="3" transform="rotate(90 23 3)" />
    <circle className="fill" cx="13" cy="3" r="3" transform="rotate(90 13 3)" />
    <circle className="fill" cx="3" cy="3" r="3" transform="rotate(90 3 3)" />
  </Wrapper>
)
