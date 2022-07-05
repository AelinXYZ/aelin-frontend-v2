import React from 'react'
import styled from 'styled-components'

const Wrapper = styled.svg`
  .fill {
    fill: ${({ theme: { colors } }) => colors.textColor};
  }
`

export const Search: React.FC<{ className?: string }> = (props) => (
  <Wrapper
    className={`search ${props.className}`}
    fill="none"
    height="12"
    viewBox="0 0 12 12"
    width="12"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      className="fill"
      d="M11.8488 11.1414L8.40578 7.69599C9.08454 6.88197 9.49277 5.8417 9.49277 4.70552C9.49277 2.11345 7.36551 0.00585938 4.74885 0.00585938C2.13219 0.00585938 0 2.11591 0 4.70798C0 7.30005 2.12727 9.40764 4.74393 9.40764C5.85552 9.40764 6.87857 9.02645 7.69013 8.3895L11.1454 11.8448C11.3471 12.0464 11.6471 12.0464 11.8488 11.8448C12.0504 11.6431 12.0504 11.3431 11.8488 11.1414ZM1.0083 4.70798C1.0083 2.67171 2.68552 1.01662 4.74393 1.01662C6.80234 1.01662 8.47956 2.67171 8.47956 4.70798C8.47956 6.74425 6.80234 8.39934 4.74393 8.39934C2.68552 8.39934 1.0083 6.7418 1.0083 4.70798Z"
    />
  </Wrapper>
)
