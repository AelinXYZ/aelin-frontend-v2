import Link from 'next/link'
import { useEffect, useState } from 'react'
import styled from 'styled-components'

import { BigNumber } from '@ethersproject/bignumber'
import { formatUnits } from '@ethersproject/units'

import { BootNodeLogo } from '@/src/components/assets/BootNodeLogo'
import { ChevronDown as BaseChevronDown } from '@/src/components/assets/ChevronDown'
import { Dropdown, DropdownItem } from '@/src/components/dropdown/Dropdown'
import { ButtonPrimary } from '@/src/components/pureStyledComponents/buttons/Button'
import { InnerContainer as BaseInnerContainer } from '@/src/components/pureStyledComponents/layout/InnerContainer'
import { chainsConfig, getNetworkConfig } from '@/src/constants/chains'
import { ZERO_BN } from '@/src/constants/misc'
import { useWeb3Connection } from '@/src/providers/web3ConnectionProvider'
import { truncateStringInTheMiddle } from '@/src/utils/tools'

const vbAddress = '0xAb5801a7D398351b8bE11C439e05C5B3259aeC9B'

const Wrapper = styled.div`
  align-items: center;
  background-color: #000;
  color: #fff;
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

const StartWrapper = styled.div`
  align-items: center;
  display: flex;
`

const EndWrapper = styled.div`
  align-items: center;
  display: flex;
`

const ButtonWrapper = styled.div`
  margin-left: 10px;
`

const ChevronDown = styled(BaseChevronDown)`
  margin-left: 10px;
`

const ExtraInfo = styled.div`
  align-items: center;
  display: flex;
`

const Info = styled.div`
  column-gap: 10px;
  display: grid;
  font-size: 11px;
  grid-template-columns: 1fr 1fr;
  margin-left: 20px;
`

const Item = styled.div`
  max-width: 130px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`

export const Header: React.FC = (props) => {
  const {
    address = '',
    appChainId,
    connectWallet,
    disconnectWallet,
    isAppConnected,
    isWalletConnected,
    pushNetwork,
    readOnlyAppProvider,
    setAppChainId,
    wallet,
    walletChainId,
    web3Provider,
  } = useWeb3Connection()

  const chainOptions = Object.values(chainsConfig)

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

  const [currentChain, setCurrentChain] = useState(getNetworkConfig(appChainId).name)

  return (
    <Wrapper as="header" {...props}>
      <InnerContainer>
        <StartWrapper>
          <Link href="/" passHref>
            <HomeLink>
              <Logo />
            </HomeLink>
          </Link>
          <ButtonWrapper>
            <Dropdown
              currentItem={chainOptions.findIndex(({ id }) => id === appChainId)}
              dropdownButtonContent={
                <ButtonPrimary>
                  {currentChain}
                  <ChevronDown />
                </ButtonPrimary>
              }
              items={chainOptions.map((item, index) => (
                <DropdownItem
                  key={index}
                  onClick={() => {
                    setCurrentChain(item.name)
                    setAppChainId(item.chainId)
                  }}
                >
                  {item.name}
                </DropdownItem>
              ))}
            />
          </ButtonWrapper>
          {isWalletConnected && !isAppConnected && walletChainId !== appChainId && (
            <ButtonWrapper>
              <ButtonPrimary onClick={pushNetwork}>Switch to {currentChain}</ButtonPrimary>
            </ButtonWrapper>
          )}
        </StartWrapper>
        <EndWrapper>
          {isWalletConnected ? (
            <ExtraInfo>
              <Info>
                <div>
                  <Item>Connected to: {wallet?.name}</Item>
                  {address && <Item>Address: {truncateStringInTheMiddle(address, 6, 6)}</Item>}
                </div>
                <div>
                  <Item>App chainId: {appChainId}</Item>
                  <Item>
                    {balance?.name}: {balance?.balance}
                  </Item>
                </div>
              </Info>
              <ButtonWrapper>
                <ButtonPrimary onClick={disconnectWallet}>Disconnect</ButtonPrimary>
              </ButtonWrapper>
            </ExtraInfo>
          ) : (
            <ButtonPrimary onClick={connectWallet}>Connect</ButtonPrimary>
          )}
        </EndWrapper>
      </InnerContainer>
    </Wrapper>
  )
}
