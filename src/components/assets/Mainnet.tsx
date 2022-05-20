import React from 'react'
import styled from 'styled-components'

const Wrapper = styled.svg``

Wrapper.defaultProps = {
  className: 'networkIcon',
}

export const Mainnet: React.FC<{ className?: string }> = (props) => (
  <Wrapper
    className={`mainnet ${props.className}`}
    height="18"
    viewBox="0 0 32 32"
    width="18"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <g fill="none" fillRule="evenodd">
      <circle cx="16" cy="16" fill="#627EEA" r="16" />
      <g fill="#FFF" fillRule="nonzero">
        <path d="M16.498 4v8.87l7.497 3.35z" fillOpacity=".602" />
        <path d="M16.498 4L9 16.22l7.498-3.35z" />
        <path d="M16.498 21.968v6.027L24 17.616z" fillOpacity=".602" />
        <path d="M16.498 27.995v-6.028L9 17.616z" />
        <path d="M16.498 20.573l7.497-4.353-7.497-3.348z" fillOpacity=".2" />
        <path d="M9 16.22l7.498 4.353v-7.701z" fillOpacity=".602" />
      </g>
    </g>
  </Wrapper>
)
