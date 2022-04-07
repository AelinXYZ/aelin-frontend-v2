import { HTMLAttributes, useEffect } from 'react'
import ReactDOM from 'react-dom'
import styled from 'styled-components'

import { ButtonPrimaryLight } from '@/src/components/pureStyledComponents/buttons/Button'
import { BaseCard } from '@/src/components/pureStyledComponents/common/BaseCard'

const Wrapper = styled.div`
  align-items: center;
  background-color: rgba(0, 0, 0, 0.6);
  display: flex;
  flex-direction: column;
  height: 100vh;
  left: 0;
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
    size === 'sm' ? '325px' : size === 'md' ? '500px' : size === 'lg' ? '800px' : `${size}`};
`

const Title = styled.h1`
  color: ${({ theme }) => theme.colors.textColor};
  font-family: ${({ theme }) => theme.fonts.textColor};
  font-size: 1.8rem;
  font-weight: 700;
  line-height: 1.2;
  margin: 0 0 30px;
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

export type modalSize = 'sm' | 'md' | 'lg' | string

interface Props extends HTMLAttributes<HTMLDivElement> {
  onClose: () => void
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

  useEffect(() => {
    document.body.style.overflow = 'hidden'
  }, [])

  const close = () => {
    document.body.style.overflow = 'auto'
    onClose()
  }

  return (
    portal &&
    ReactDOM.createPortal(
      <Wrapper onClick={close} {...restProps}>
        <Card
          onClick={(e) => {
            e.stopPropagation()
          }}
          size={size}
        >
          <Title>{title}</Title>
          <Contents>
            {children}
            <ButtonPrimaryLight onClick={close}>Cancel</ButtonPrimaryLight>
          </Contents>
        </Card>
      </Wrapper>,
      portal,
    )
  )
}
