import React, { ReactElement, ReactNode } from 'react'
import styled from 'styled-components'

import {
  ButtonGradient,
  ButtonGradientSm,
  ButtonPrimaryLight,
  ButtonPrimaryLightSm,
} from '@/src/components/pureStyledComponents/buttons/Button'
import { ChainsValues, chainsConfig } from '@/src/constants/chains'
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
  font-size: 1.2rem;
  font-weight: 400;
  line-height: 1.5;
  margin: 0 auto 10px;
  padding: 0 20px;
  text-align: center;
  text-decoration: none;
  width: 100%;
`

const TextBig = styled(Text)`
  font-size: 1.3rem;
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
  buttonSize?: string
  isNotConnectedText?: string
  isWrongNetworkText?: string
  networkToCheck?: ChainsValues
}

const RequiredConnection: React.FC<RequiredConnectionProps> = ({
  children,
  minHeight,
  buttonSize,
  networkToCheck,
  isNotConnectedText = 'You must be logged in.',
  isWrongNetworkText = `Please switch to this pool's network`,
  ...restProps
}) => {
  const { address, connectWallet, isWalletConnected, pushNetwork, walletChainId } =
    useWeb3Connection()
  const isConnected = isWalletConnected && address
  const isWrongNetwork = isConnected && networkToCheck && walletChainId !== networkToCheck

  if (!isConnected) {
    return (
      <Wrapper style={{ minHeight }} {...restProps}>
        {!!isNotConnectedText.length && <Text>{isNotConnectedText}</Text>}
        {buttonSize === 'sm' ? (
          <ButtonPrimaryLightSm onClick={connectWallet}>Connect wallet</ButtonPrimaryLightSm>
        ) : (
          <ButtonPrimaryLight onClick={connectWallet}>Connect wallet</ButtonPrimaryLight>
        )}
      </Wrapper>
    )
  }

  if (isWrongNetwork) {
    return (
      <Wrapper style={{ minHeight }} {...restProps}>
        {!!isWrongNetworkText.length && <TextBig>{isWrongNetworkText}</TextBig>}
        {buttonSize === 'sm' ? (
          <ButtonGradientSm onClick={() => pushNetwork(networkToCheck)}> Switch</ButtonGradientSm>
        ) : (
          <ButtonGradient onClick={() => pushNetwork(networkToCheck)}>
            Switch to {chainsConfig[networkToCheck].name}
          </ButtonGradient>
        )}
      </Wrapper>
    )
  }

  return children
}

export { withRequiredConnection, RequiredConnection }
