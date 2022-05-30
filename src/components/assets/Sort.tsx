import React from 'react'
import styled from 'styled-components'

const Wrapper = styled.svg`
  .fill {
    fill: ${({ theme: { table } }) => table.sortBackgroundColor};
  }
`

export const Sort: React.FC<{ className?: string }> = (props) => (
  <Wrapper
    className={`sort ${props.className}`}
    fill="none"
    height="13"
    viewBox="0 0 6 13"
    width="6"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path className="fill" d="M3 0.5L5.59808 5L0.401924 5L3 0.5Z" />
    <path className="fill" d="M3 12.5L0.401924 8L5.59808 8L3 12.5Z" />
  </Wrapper>
)
