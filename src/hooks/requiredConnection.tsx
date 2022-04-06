import React, { ReactElement, ReactNode } from 'react'
import styled from 'styled-components'

import { ButtonPrimary } from '@/src/components/pureStyledComponents/buttons/Button'
import { useWeb3Connection } from '@/src/providers/web3ConnectionProvider'

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  flex-grow: 0;
`

const withRequiredConnection = (Component: React.FC) =>
  function Comp<T>(props: T): ReactNode {
    const { address, connectWallet, isWalletConnected } = useWeb3Connection()
    const isConnected = isWalletConnected && address
    if (!isConnected) {
      return <ButtonPrimary onClick={connectWallet}>Connect</ButtonPrimary>
    }

    return <Component {...props} />
  }

type RequiredConnectionProps = {
  children: ReactElement
  text?: string
}

const RequiredConnection = ({ children, text }: RequiredConnectionProps) => {
  const { address, connectWallet, isWalletConnected } = useWeb3Connection()

  const isConnected = isWalletConnected && address

  if (!isConnected) {
    return (
      <Wrapper>
        <p>{text || 'You must be logged to see this'}</p>
        <ButtonPrimary onClick={connectWallet}>Connect Wallet</ButtonPrimary>
      </Wrapper>
    )
  }

  return children
}

export { withRequiredConnection, RequiredConnection }
