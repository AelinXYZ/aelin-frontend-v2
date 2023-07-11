import React from 'react'
import styled from 'styled-components'

const Wrapper = styled.svg``

Wrapper.defaultProps = {
  className: 'networkIcon',
}

export const ZkSync: React.FC<{ className?: string }> = (props) => (
  <Wrapper
    className={`zkSync ${props.className}`}
    fill="none"
    height="18"
    viewBox="0 0 18 18"
    width="18"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <rect fill="white" height="18" rx="9" width="18" />
    <g clipPath="url(#clip0_1348_201161)">
      <path
        clipRule="evenodd"
        d="M15.9528 8.98926L11.9946 5.00195V7.9221L8.06445 10.8458L11.9946 10.8485V12.9766L15.9528 8.98926Z"
        fill="#4E529A"
        fillRule="evenodd"
      />
      <path
        clipRule="evenodd"
        d="M2 8.9873L5.95824 12.9746V10.0854L9.85961 7.15974L5.95824 7.15705V5L2 8.9873Z"
        fill="#8C8DFC"
        fillRule="evenodd"
      />
    </g>
  </Wrapper>
)
