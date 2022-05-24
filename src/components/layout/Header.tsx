import Link from 'next/link'
import styled, { css } from 'styled-components'

import { ChevronDown } from '@/src/components/assets/ChevronDown'
import { DarkMode } from '@/src/components/assets/DarkMode'
import { Docs } from '@/src/components/assets/Docs'
import { Ellipsis } from '@/src/components/assets/Ellipsis'
import { Eth } from '@/src/components/assets/Eth'
import { LightMode } from '@/src/components/assets/LightMode'
import { Link as LinkSVG } from '@/src/components/assets/Link'
import { BootNodeLogo } from '@/src/components/assets/Logo'
import { Metamask } from '@/src/components/assets/Metamask'
import { Optimism } from '@/src/components/assets/Optimism'
import { CopyButton } from '@/src/components/button/CopyButton'
import { Dropdown, DropdownItem, DropdownPosition } from '@/src/components/common/Dropdown'
import { Modal } from '@/src/components/common/Modal'
import { Notifications } from '@/src/components/common/Notifications'
import { TopMenu as BaseTopMenu } from '@/src/components/navigation/TopMenu'
import {
  ButtonPrimary,
  ButtonPrimaryLight,
} from '@/src/components/pureStyledComponents/buttons/Button'
import { ButtonDropdown as BaseButtonDropdown } from '@/src/components/pureStyledComponents/buttons/Button'
import { BaseCardCSS } from '@/src/components/pureStyledComponents/common/BaseCard'
import { InnerContainer as BaseInnerContainer } from '@/src/components/pureStyledComponents/layout/InnerContainer'
import { getChainsByEnvironmentArray, getNetworkConfig } from '@/src/constants/chains'
import { ThemeType, useThemeContext } from '@/src/providers/themeSwitchProvider'
import { useWeb3Connection } from '@/src/providers/web3ConnectionProvider'
import { shortenAddress } from '@/src/utils/string'

const Wrapper = styled.header`
  --header-height: 60px;
  --header-button-height: 34px;

  align-items: center;
  background-color: ${({ theme }) => theme.colors.mainBodyBackground};
  display: flex;
  flex-grow: 0;
  flex-shrink: 0;
  height: var(--header-height);
  margin: 0 0 15px;
  position: sticky;
  top: 0;
  z-index: 5;

  @media (min-width: ${({ theme }) => theme.themeBreakPoints.tabletLandscapeStart}) {
    background-color: transparent;
    margin-bottom: 20px;
    position: relative;
  }
`

const InnerContainer = styled(BaseInnerContainer)`
  align-items: center;
  flex-direction: row;
  justify-content: center;
  max-height: 100%;
  position: relative;

  @media (min-width: ${({ theme }) => theme.themeBreakPoints.tabletLandscapeStart}) {
    ${BaseCardCSS}
    justify-content: space-between;
    padding: 12px 20px 12px 30px;
  }
`

const HomeLink = styled.a`
  position: relative;
  transition: opacity 0.05s linear;
  z-index: 10;

  &:active {
    opacity: 0.7;
  }
`

const Logo = styled(BootNodeLogo)`
  cursor: pointer;
  max-height: calc(var(--header-height) - 20px);
`

const StartWrapper = styled.div`
  align-items: center;
  display: flex;
`

const HeaderDropdown = styled(Dropdown)`
  .dropdownItems {
    background-color: ${({ theme }) => theme.colors.gray};
    border-color: ${({ theme }) => theme.colors.lightGray};
    border-radius: 6px;
    border-style: solid;
    border-width: 0.5px;
    top: calc(100% + 10px);
  }
`

const ResponsiveDropdownCSS = css`
  display: none;

  @media (min-width: ${({ theme }) => theme.themeBreakPoints.tabletLandscapeStart}) {
    display: flex;
  }
`

const NetworkDropdown = styled(HeaderDropdown)`
  ${ResponsiveDropdownCSS}
`

const WalletDropdown = styled(HeaderDropdown)`
  ${ResponsiveDropdownCSS}
`

const EndWrapper = styled.div`
  align-items: center;
  display: flex;
  gap: 20px;
  height: 100%;
  justify-content: space-between;
  left: 0;
  position: absolute;
  top: 0;
  width: 100%;
  z-index: 5;

  @media (min-width: ${({ theme }) => theme.themeBreakPoints.tabletLandscapeStart}) {
    justify-content: flex-end;
    left: auto;
    position: relative;
    top: auto;
    width: auto;
  }
`

const TopMenu = styled(BaseTopMenu)`
  margin-left: auto;
  margin-right: 30px;
`

const Item = styled.div`
  max-width: 130px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`

const Line = styled.div`
  display: none;

  @media (min-width: ${({ theme }) => theme.themeBreakPoints.tabletLandscapeStart}) {
    background: rgba(255, 255, 255, 0.25);
    display: block;
    height: 24px;
    width: 1px;
  }
`

const DropdownButton = styled.button`
  align-items: center;
  background-color: transparent;
  border: none;
  color: ${({ theme }) => theme.colors.textColor};
  cursor: pointer;
  display: flex;
  gap: 8px;
  height: var(--header-button-height);
  padding: 0;
`

const NetworkError = styled.p`
  color: ${({ theme }) => theme.colors.error};
  font-size: 1.6rem;
  line-height: 1.4;
  margin: 0 auto 30px;
`

const ButtonDropdown = styled(BaseButtonDropdown)`
  max-width: 100%;
  width: 250px;
`

const WalletDropdownContents = styled.div`
  align-items: center;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 10px 17px;
`

const WalletDropdownRow = styled.div`
  align-items: center;
  display: flex;
  flex-shrink: 0;
  font-size: 1.4rem;
  gap: 8px;
  justify-content: center;
  margin-bottom: 10px;
  width: 100%;
`

const WalletButton = styled(ButtonPrimaryLight)`
  border-width: 0.5px;
  font-size: 1rem;
  font-weight: 500;
  height: 24px;
  line-height: 1.2;
  margin-bottom: 6px;
  width: 100px;

  &:last-child {
    margin-bottom: 0;
  }
`

const EllipsisButton = styled.button`
  align-items: center;
  background: none;
  border: none;
  cursor: pointer;
  display: flex;
  height: var(--header-button-height);
  justify-content: center;
  transition: opacity 0.15s linear;
  width: fit-content;

  &:active {
    opacity: 0.7;
  }
`

const ExternalLink = styled.a`
  display: flex;
  justify-content: center;
  align-items: center;
  text-decoration: none;
  transition: opacity 0.15s linear;
  width: 12px;
  height: 12px;

  svg {
    display: block;
    height: 100%;
    width: 100%;
  }

  &:active {
    opacity: 0.7;
  }
`

export const Header: React.FC = (props) => {
  const {
    address = '',
    appChainId,
    connectWallet,
    disconnectWallet,
    isWalletConnected,
    isWalletNetworkSupported,
    pushNetwork,
    walletChainId,
  } = useWeb3Connection()
  const currentChain = getNetworkConfig(appChainId)
  const wrongNetwork = isWalletConnected && !isWalletNetworkSupported

  const { currentThemeName, switchTheme } = useThemeContext()

  const networksDropdownItems = getChainsByEnvironmentArray().map((item, index) => (
    <DropdownItem
      key={index}
      onClick={() => {
        pushNetwork(item.chainId)
      }}
    >
      {getNetworkConfig(item.chainId).icon}
      {item.name}
    </DropdownItem>
  ))

  return (
    <>
      <Wrapper {...props}>
        <InnerContainer>
          <StartWrapper>
            <Link href="/" passHref>
              <HomeLink>
                <Logo />
              </HomeLink>
            </Link>
          </StartWrapper>
          <TopMenu />
          <EndWrapper>
            <NetworkDropdown
              currentItem={getChainsByEnvironmentArray().findIndex(
                ({ chainId }) => chainId === walletChainId,
              )}
              disabled={!isWalletConnected}
              dropdownButtonContent={
                <DropdownButton>
                  {wrongNetwork ? (
                    'Select Network'
                  ) : (
                    <>
                      {currentChain.icon}
                      {currentChain.name}
                    </>
                  )}
                  <ChevronDown />
                </DropdownButton>
              }
              dropdownPosition={DropdownPosition.center}
              items={networksDropdownItems}
            />
            {isWalletConnected && (
              <>
                <Line />
                <WalletDropdown
                  dropdownButtonContent={
                    <DropdownButton>
                      <Metamask />
                      {address && <Item>{shortenAddress(address)}</Item>}
                      <ChevronDown />
                    </DropdownButton>
                  }
                  dropdownPosition={DropdownPosition.center}
                  items={[
                    <WalletDropdownContents key={'wallet_dopdown'}>
                      <WalletDropdownRow>
                        <Metamask />
                      </WalletDropdownRow>
                      <WalletDropdownRow>{address && shortenAddress(address)}</WalletDropdownRow>
                      {address && (
                        <WalletDropdownRow>
                          <CopyButton copyValue={address} />
                          <ExternalLink
                            href={`${currentChain.blockExplorerUrls}/address/${address}`}
                            target="_blank"
                          >
                            <LinkSVG />
                          </ExternalLink>
                        </WalletDropdownRow>
                      )}
                      <WalletButton>Change wallet</WalletButton>
                      <WalletButton onClick={disconnectWallet}>Disconnect</WalletButton>
                    </WalletDropdownContents>,
                  ]}
                />
                <Line />
                <Notifications />
                <Line />
                <HeaderDropdown
                  activeItemHighlight={false}
                  disabled={!isWalletConnected}
                  dropdownButtonContent={
                    <EllipsisButton>
                      <Ellipsis />
                    </EllipsisButton>
                  }
                  dropdownPosition={DropdownPosition.right}
                  items={[
                    <DropdownItem
                      as="a"
                      href="https://docs.aelin.xyz/"
                      key={'external_links_1'}
                      target="_blank"
                    >
                      <Docs />
                      Docs
                    </DropdownItem>,
                    <DropdownItem
                      as="a"
                      href="https://app.uniswap.org/#/swap?outputCurrency=0xa9c125bf4c8bb26f299c00969532b66732b1f758&inputCurrency=ETH&chain=kovan"
                      key={'external_links_2'}
                      target="_blank"
                    >
                      <Eth />
                      Buy Aelin L1
                    </DropdownItem>,
                    <DropdownItem
                      as="a"
                      href="https://app.uniswap.org/#/swap?outputCurrency=0x61BAADcF22d2565B0F471b291C475db5555e0b76&inputCurrency=ETH&chain=optimism"
                      key={'external_links_3'}
                      target="_blank"
                    >
                      <Optimism />
                      Buy Aelin OP
                    </DropdownItem>,
                    <DropdownItem key={'external_links_4'} onClick={switchTheme}>
                      {currentThemeName === ThemeType.light ? (
                        <>
                          <DarkMode />
                          Dark mode
                        </>
                      ) : (
                        <>
                          <LightMode />
                          Light mode
                        </>
                      )}
                    </DropdownItem>,
                  ]}
                />
              </>
            )}
            {!isWalletConnected && (
              <>
                <Line />
                <ButtonPrimary onClick={connectWallet}>Connect</ButtonPrimary>
              </>
            )}
          </EndWrapper>
        </InnerContainer>
      </Wrapper>
      {wrongNetwork && (
        <Modal title="Wrong network">
          <NetworkError>Please connect to a valid network.</NetworkError>
          <Dropdown
            currentItem={getChainsByEnvironmentArray().findIndex(
              ({ chainId }) => chainId === walletChainId,
            )}
            disabled={!isWalletConnected}
            dropdownButtonContent={
              <ButtonDropdown>
                {wrongNetwork ? (
                  'Select Network'
                ) : (
                  <>
                    {currentChain.icon}
                    {currentChain.name}
                  </>
                )}
              </ButtonDropdown>
            }
            items={networksDropdownItems}
          />
        </Modal>
      )}
    </>
  )
}
