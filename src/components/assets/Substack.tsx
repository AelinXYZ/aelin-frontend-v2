import React from 'react'
import styled from 'styled-components'

const Wrapper = styled.svg``

export const Substack: React.FC<{ className?: string }> = (props) => (
  <Wrapper
    className={`substack ${props.className}`}
    height="18"
    stroke="none"
    stroke-width="1.8"
    viewBox="0 0 21 24"
    width="16"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <g>
      <title></title>
      <path d="M20.9991 5.40625H0V8.24275H20.9991V5.40625Z"></path>
      <path d="M0 10.8125V24.0004L10.4991 18.1107L21 24.0004V10.8125H0Z"></path>
      <path d="M20.9991 0H0V2.83603H20.9991V0Z"></path>
    </g>
  </Wrapper>
)
