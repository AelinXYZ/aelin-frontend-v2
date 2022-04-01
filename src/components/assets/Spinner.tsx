import React from 'react'
import styled from 'styled-components'

const Wrapper = styled.svg`
  .stopColor {
    stop-color: ${({ theme: { colors } }) => colors.primary};
  }

  .fill {
    fill: ${({ theme: { colors } }) => colors.primary};
  }
`

export const Spinner: React.FC<{ className?: string }> = (props) => (
  <Wrapper
    className={`spinner ${props.className}`}
    height="38"
    viewBox="0 0 38 38"
    width="38"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <defs>
      <linearGradient id="loader" x1="8.042%" x2="65.682%" y1="0%" y2="23.865%">
        <stop className="stopColor" offset="0%" stopOpacity="0" />
        <stop className="stopColor" offset="63.146%" stopOpacity=".631" />
        <stop className="stopColor" offset="100%" />
      </linearGradient>
    </defs>
    <g fill="none" fillRule="evenodd">
      <g transform="translate(1 1)">
        <path d="M36 18c0-9.94-8.06-18-18-18" stroke="url(#loader)" strokeWidth="2">
          <animateTransform
            attributeName="transform"
            dur="0.9s"
            from="0 18 18"
            repeatCount="indefinite"
            to="360 18 18"
            type="rotate"
          />
        </path>
        <circle className="fill" cx="36" cy="18" r="1">
          <animateTransform
            attributeName="transform"
            dur="0.9s"
            from="0 18 18"
            repeatCount="indefinite"
            to="360 18 18"
            type="rotate"
          />
        </circle>
      </g>
    </g>
  </Wrapper>
)
