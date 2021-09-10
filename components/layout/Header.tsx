import Link from 'next/link'
import { useEffect, useState } from 'react'
import styled from 'styled-components'

import { formatUnits } from '@ethersproject/units'
import Select from 'react-select'
import { $enum } from 'ts-enum-util'

import { BootNodeLogo } from '@/components/assets/BootNodeLogo'
import { InnerContainer as BaseInnerContainer } from '@/components/pureStyledComponents/layout/InnerContainer'
import { ChainId } from '@/constants/chains'
import { ZERO_BN } from '@/constants/util'
import { useWeb3Connection } from '@/utils/web3Connection'

const vbAddress = '0xAb5801a7D398351b8bE11C439e05C5B3259aeC9B'

const Wrapper = styled.div`
  align-items: center;
  background-color: #000;
  display: flex;
  flex-grow: 0;
  height: ${({ theme }) => theme.header.height};
  position: sticky;
  top: 0;
`

const InnerContainer = styled(BaseInnerContainer)`
  align-items: center;
  flex-direction: row;
  justify-content: space-between;
`

const HomeLink = styled.span`
  transition: opacity 0.05s linear;

  &:active {
    opacity: 0.7;
  }
`

const Logo = styled(BootNodeLogo)`
  cursor: pointer;
  max-height: calc(${({ theme }) => theme.header.height} - 20px);
`

export const Header: React.FC = (props) => {
  const {
    address,
    appChainId,
    connectWallet,
    disconnectWallet,
    isAppConnected,
    isWalletConnected,
    pushNetwork,
    readOnlyAppProvider,
    setAppChainId,
    wallet,
    web3Provider,
  } = useWeb3Connection()

  const chainOptions = $enum(ChainId).map((value, key) => ({
    value,
    label: key,
  }))

  const [balance, setBalance] = useState<{ name: string; balance: string } | undefined>()

  useEffect(() => {
    async function getBalance() {
      if (isAppConnected) {
        const res = (await web3Provider?.getBalance(address!)) || ZERO_BN
        if (isAppConnected) {
          setBalance({
            name: 'your balance',
            balance: formatUnits(res || ZERO_BN),
          })
        }
      } else {
        const res = await readOnlyAppProvider?.getBalance(vbAddress)
        if (!isAppConnected) {
          setBalance({ name: 'Vitalik balance', balance: formatUnits(res || ZERO_BN) })
        }
      }
    }

    if (!isWalletConnected && !readOnlyAppProvider) {
      setBalance(undefined)
    } else {
      getBalance()
    }
  }, [isAppConnected, isWalletConnected, readOnlyAppProvider, web3Provider, address])

  return (
    <Wrapper as="header" {...props}>
      <InnerContainer>
        <Link href="/">
          <HomeLink>
            <Logo />
          </HomeLink>
        </Link>
        <div>
          <div>
            <h2>App Network</h2>
            <Select
              defaultValue={chainOptions[0]}
              onChange={(option) => setAppChainId(option?.value || 1)}
              options={chainOptions}
            />
            isAppConnected: {isAppConnected ? 'yes' : 'no'}
            <br />
            App chainId: {appChainId}
            {isWalletConnected && !isAppConnected && (
              <button onClick={pushNetwork}>Switch Network</button>
            )}
            <div>
              {balance?.name}: {balance?.balance}
            </div>
          </div>

          <div>
            <h2>Wallet Connect</h2>
            {isWalletConnected ? (
              <div>
                <div>
                  <button onClick={disconnectWallet}>Disconnect</button>
                </div>
                <div>Connected to: {wallet?.name}</div>
                <div>{address}</div>
              </div>
            ) : (
              <button onClick={connectWallet}>Connect</button>
            )}
          </div>
        </div>
      </InnerContainer>
    </Wrapper>
  )
}
