import React, { ButtonHTMLAttributes } from 'react'
import styled from 'styled-components'

import { CopyToClipboard } from 'react-copy-to-clipboard'

import { Copy } from '@/src/components/assets/Copy'

const Wrapper = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  height: 18px;
  margin: 0;
  outline: none;
  padding: 0;
  transition: opacity 0.15s linear;
  width: 19px;

  &:active {
    opacity: 0.5;
  }

  &:hover {
    .a {
      fill: ${({ theme }) => theme.colors.primary};
    }
  }

  &[disabled],
  &[disabled]:hover {
    cursor: not-allowed;
    opacity: 0.5;
  }
`

interface ButtonCopyProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  copyValue: string
}

export const CopyButton: React.FC<ButtonCopyProps> = (props) => {
  const { copyValue, ...restProps } = props

  return (
    <CopyToClipboard text={copyValue}>
      <Wrapper className="buttonCopy" {...restProps}>
        <Copy />
      </Wrapper>
    </CopyToClipboard>
  )
}
