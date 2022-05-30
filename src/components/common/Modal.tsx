import { HTMLAttributes } from 'react'
import ReactDOM from 'react-dom'
import styled, { css } from 'styled-components'

import { ButtonPrimaryLight } from '@/src/components/pureStyledComponents/buttons/Button'
import { BaseCard } from '@/src/components/pureStyledComponents/common/BaseCard'

const Wrapper = styled.div`
  align-items: center;
  background-color: rgba(0, 0, 0, 0.6);
  display: flex;
  flex-direction: column;
  height: 100vh;
  left: 0;
  padding: 10px;
  position: fixed;
  top: 0;
  width: 100vw;
  z-index: 100;
  overflow: auto;
`

const Card = styled(BaseCard)<{ size?: modalSize }>`
  border-color: ${({ theme }) => theme.colors.lightGray};
  display: flex;
  flex-direction: column;
  margin: auto;
  max-width: 100%;
  padding: 40px 25px;
  width: ${({ size }) =>
    size === 'sm' ? '325px' : size === 'md' ? '500px' : size === 'lg' ? '720px' : `${size}`};
`

const Title = styled.h1`
  color: ${({ theme }) => theme.colors.textColor};
  font-family: ${({ theme }) => theme.fonts.fontFamilyTitle};
  font-size: 1.8rem;
  font-weight: 700;
  line-height: 1.2;
  margin: 0 0 20px;
  text-align: center;
  width: 100%;
`

const Contents = styled.div`
  align-items: center;
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  justify-content: center;
`

const Cancel = styled(ButtonPrimaryLight)`
  min-width: 160px;
`

export const WidthLimitsCSS = css`
  max-width: 100%;
  width: 320px;
`

export const ModalButtonCSS = css`
  margin: 40px auto 10px;
  min-width: 160px;
`

export const ModalTextCSS = css`
  color: ${({ theme }) => theme.colors.textColorLight};
  font-size: 1.4rem;
  font-weight: 400;
  line-height: 1.2;
  margin: 0 auto 20px;
  text-align: center;
`

export const ModalText = styled.p`
  ${ModalTextCSS}
  ${WidthLimitsCSS}
`

export const ModalLine = styled.div`
  background-color: ${({ theme }) => theme.colors.lightGray};
  height: 1px;
  margin: 0 auto 20px;
  width: 180px;
`

export type modalSize = 'sm' | 'md' | 'lg' | string

interface Props extends HTMLAttributes<HTMLDivElement> {
  onClose?: () => void
  size?: modalSize
  title?: string
}

export const Modal: React.FC<Props> = ({
  children,
  onClose,
  size = 'md',
  title = '',
  ...restProps
}: Props) => {
  const portal: HTMLElement | null = document.getElementById('modals')
  const validOnClose = onClose && typeof onClose === 'function'

  const close = () => {
    if (validOnClose) {
      onClose()
    }
  }

  return (
    portal &&
    ReactDOM.createPortal(
      <Wrapper className="modal" onClick={close} {...restProps}>
        <Card
          className="modalCard"
          onClick={(e) => {
            e.preventDefault()
            e.stopPropagation()
          }}
          size={size}
        >
          <Title>{title}</Title>
          <Contents>
            {children}
            {validOnClose && <Cancel onClick={close}>Cancel</Cancel>}
          </Contents>
        </Card>
      </Wrapper>,
      portal,
    )
  )
}
