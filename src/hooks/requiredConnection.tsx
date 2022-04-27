import React, { ReactElement, ReactNode } from 'react'
import styled from 'styled-components'

import { ButtonPrimaryLight } from '@/src/components/pureStyledComponents/buttons/Button'
import { useWeb3Connection } from '@/src/providers/web3ConnectionProvider'

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  flex-grow: 0;
`

const Text = styled.p`
  color: ${({ theme }) => theme.colors.textColor};
  display: flex;
  font-size: 1rem;
  font-weight: 400;
  line-height: 1.5;
  margin: 0 auto 10px;
  padding: 0 20px;
  text-align: center;
  text-decoration: none;
  width: 100%;
`

const withRequiredConnection = (Component: React.FC) =>
  function Comp<T>(props: T): ReactNode {
    const { address, connectWallet, isWalletConnected } = useWeb3Connection()
    const isConnected = isWalletConnected && address

    return !isConnected ? (
      <ButtonPrimaryLight onClick={connectWallet}>Connect</ButtonPrimaryLight>
    ) : (
      <Component {...props} />
    )
  }

type RequiredConnectionProps = {
  children: ReactElement
  minHeight?: number
  text?: string
}

const RequiredConnection: React.FC<RequiredConnectionProps> = ({
  children,
  minHeight,
  text = 'You must be logged in.',
  ...restProps
}: RequiredConnectionProps) => {
  const { address, connectWallet, isWalletConnected } = useWeb3Connection()
  const isConnected = isWalletConnected && address

  return !isConnected ? (
    <Wrapper style={{ minHeight }} {...restProps}>
      <Text>{text}</Text>
      <ButtonPrimaryLight onClick={connectWallet}>Connect wallet</ButtonPrimaryLight>
    </Wrapper>
  ) : (
    children
  )
}

export { withRequiredConnection, RequiredConnection }
