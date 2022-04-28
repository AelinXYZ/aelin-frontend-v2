import { ReactNode } from 'react'
import styled from 'styled-components'

import { Toast, toast } from 'react-hot-toast'

import { Close } from '@/src/components/assets/Close'

const Wapper = styled.div`
  display: grid;
  grid-template-columns: 50px 200px;
  padding: 10px;
  height: 70px;
  border-radius: ${({ theme: { toast } }) => toast.borderRadius};
  border-style: ${({ theme: { toast } }) => toast.borderStyle};
  border-width: ${({ theme: { toast } }) => toast.borderWidth};
  background-color: ${({ theme: { toast } }) => toast.backgroundColor};
  box-shadow: ${({ theme: { toast } }) => toast.boxShadow};
`

const IconContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`

const InnerWrapper = styled.div`
  display: flex;
  position: relative;
  justify-content: space-between;
  align-items: flex-start;
`

const TextContainer = styled.div`
  padding: 5px;
`

const ButtonClose = styled.button`
  cursor: pointer;
  margin: 0;
  border: 0;
  padding: 0;
  outline: none;
  background: transparent;
`

const Title = styled.p`
  font-size: 1.4rem;
  font-weight: 500;
  margin 2px;
`

const Link = styled.a`
  font-size: 1.2rem;
  color: ${({ theme: { colors } }) => colors.textColorLight};
`

export const ToastComponent = ({
  icon,
  link,
  t,
  title,
}: {
  t: Toast
  title: string
  link: {
    url: string
    text: string
  }
  icon: ReactNode
}) => (
  <Wapper>
    <IconContainer>{icon}</IconContainer>
    <InnerWrapper>
      <TextContainer>
        <Title>{title}</Title>
        <Link href={link.url} rel="noreferrer" target="_blank">
          {link.text}
        </Link>
      </TextContainer>
      <ButtonClose onClick={() => toast.dismiss(t.id)}>
        <Close />
      </ButtonClose>
    </InnerWrapper>
  </Wapper>
)
