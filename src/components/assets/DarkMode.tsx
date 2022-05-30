import React from 'react'
import styled from 'styled-components'

const Wrapper = styled.svg`
  fill-rule: nonzero;
  fill: #000;
  opacity: 1;
  stroke-dasharray: none;
  stroke-linecap: butt;
  stroke-linejoin: miter;
  stroke-miterlimit: 10;
  stroke-width: 1;
  stroke: none;
`

export const DarkMode: React.FC<{ className?: string }> = (props) => (
  <Wrapper
    className={`darkMode ${props.className}`}
    fill="none"
    height="16"
    viewBox="0 0 256 256"
    width="16"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M247.939 171.973a4.16 4.16 0 00-4.748-.6c-44.348 23.521-98.773 7.876-123.885-35.62-25.112-43.497-11.455-98.446 31.092-125.098a4.147 4.147 0 001.851-4.409 4.148 4.148 0 00-3.526-3.229C121.155-.526 93.855 4.955 69.76 18.87c-29.145 16.818-49.994 43.992-58.705 76.5s-4.24 66.464 12.59 95.612c16.827 29.148 43.998 49.997 76.507 58.707 10.856 2.907 21.871 4.347 32.817 4.347 21.832 0 43.381-5.725 62.794-16.934 24.09-13.908 42.49-34.814 53.206-60.458a4.157 4.157 0 00-1.03-4.671z"
      fill="#000"
      strokeMiterlimit="10"
      strokeWidth="0"
    />
  </Wrapper>
)
