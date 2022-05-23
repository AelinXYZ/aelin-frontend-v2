import { ReactNode } from 'react'
import styled from 'styled-components'

import { Toast, toast } from 'react-hot-toast'

import { Close } from '@/src/components/assets/Close'

const Wapper = styled.div`
  display: grid;
  grid-template-columns: 50px 200px;
  padding: 10px;
  height: 70px;
  border-radius: 8px;
  border-style: solid;
  border-width: 0.5px;
  background-color: ${({ theme: { toast } }) => toast.backgroundColor};
  box-shadow: ${({ theme: { toast } }) => toast.boxShadow};
`

const IconContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 50px;
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

const Text = styled.p`
  font-size: 1.2rem;
  color: ${({ theme: { colors } }) => colors.textColorLight};
`

export const ToastComponent = ({
  icon,
  link,
  message,
  t,
  title,
}: {
  icon: ReactNode
  link?: {
    url: string
    text: string
  }
  message?: string
  t: Toast
  title: string
}) => (
  <Wapper>
    <IconContainer>{icon}</IconContainer>
    <InnerWrapper>
      <TextContainer>
        <Title>{title}</Title>
        {link && (
          <Link href={link.url} rel="noreferrer" target="_blank">
            {link.text}
          </Link>
        )}
        {message && <Text>{message}</Text>}
      </TextContainer>
      <ButtonClose onClick={() => toast.dismiss(t.id)}>
        <Close />
      </ButtonClose>
    </InnerWrapper>
  </Wapper>
)
