import Link from 'next/link'
import { useEffect, useState } from 'react'
import styled from 'styled-components'

import { formatUnits } from '@ethersproject/units'
import { $enum } from 'ts-enum-util'

import { BootNodeLogo } from '@/components/assets/BootNodeLogo'
import { ChevronDown as BaseChevronDown } from '@/components/assets/ChevronDown'
import { Button } from '@/components/buttons/Button'
import { Dropdown, DropdownItem } from '@/components/dropdown/Dropdown'
import { InnerContainer as BaseInnerContainer } from '@/components/pureStyledComponents/layout/InnerContainer'
import { ChainId } from '@/constants/chains'
import { ZERO_BN } from '@/constants/util'
import { truncateStringInTheMiddle } from '@/utils/tools'
import { useWeb3Connection } from '@/utils/web3Connection'

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

  const [currentChain, setCurrentChain] = useState(chainOptions[0].label)

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
              currentItem={0}
              dropdownButtonContent={
                <Button>
                  {currentChain}
                  <ChevronDown />
                </Button>
              }
              items={chainOptions.map((item, index) => (
                <DropdownItem
                  key={index}
                  onClick={() => {
                    setCurrentChain(item.label)
                    setAppChainId(item.value)
                  }}
                >
                  {item.label}
                </DropdownItem>
              ))}
            />
          </ButtonWrapper>
          {isWalletConnected && !isAppConnected && (
            <ButtonWrapper>
              <Button onClick={pushNetwork}>Switch to {currentChain}</Button>
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
                <Button onClick={disconnectWallet}>Disconnect</Button>
              </ButtonWrapper>
            </ExtraInfo>
          ) : (
            <Button onClick={connectWallet}>Connect</Button>
          )}
        </EndWrapper>
      </InnerContainer>
    </Wrapper>
  )
}
