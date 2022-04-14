import React from 'react'
import styled from 'styled-components'

const Wrapper = styled.svg`
  .fill {
    fill: #fff;
  }
`

export const Copy: React.FC<{ className?: string }> = (props) => (
  <Wrapper
    className={`copy ${props.className}`}
    fill="none"
    height="18"
    viewBox="0 0 19 18"
    width="19"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      className="fill"
      clipRule="evenodd"
      d="M12.2954 1.5H4.11364C3.36363 1.5 2.75 2.11364 2.75 2.86364V12.4091H4.11364V2.86364H12.2954V1.5ZM14.3409 4.22728H6.84092C6.09091 4.22728 5.47728 4.84091 5.47728 5.59092V15.1363C5.47728 15.8864 6.09091 16.5 6.84092 16.5H14.3409C15.0909 16.5 15.7046 15.8864 15.7046 15.1363V5.59092C15.7046 4.84091 15.0909 4.22728 14.3409 4.22728ZM6.84091 15.1363H14.3409V5.59092H6.84091V15.1363Z"
      fillRule="evenodd"
    />
  </Wrapper>
)
