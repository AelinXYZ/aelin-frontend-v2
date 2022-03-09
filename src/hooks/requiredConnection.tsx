import React, { ReactNode } from 'react'

import { ButtonPrimary } from '@/src/components/pureStyledComponents/buttons/Button'
import { useWeb3Connection } from '@/src/providers/web3ConnectionProvider'

const withRequiredConnection = (Component: React.FC) =>
  function Comp<T>(props: T): ReactNode {
    const { address, connectWallet, isWalletConnected } = useWeb3Connection()
    const isConnected = isWalletConnected && address
    if (!isConnected) {
      return <ButtonPrimary onClick={connectWallet}>Connect</ButtonPrimary>
    }

    return <Component {...props} />
  }

export default withRequiredConnection
