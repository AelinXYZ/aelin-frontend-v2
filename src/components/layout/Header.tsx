import Link from 'next/link'
import styled, { css } from 'styled-components'

import { NetworkPlaceholder } from '../common/NetworkPlaceholder'
import { ChevronDown } from '@/src/components/assets/ChevronDown'
import { DarkMode } from '@/src/components/assets/DarkMode'
import { Docs } from '@/src/components/assets/Docs'
import { Ellipsis } from '@/src/components/assets/Ellipsis'
import { Eth } from '@/src/components/assets/Eth'
import { LightMode } from '@/src/components/assets/LightMode'
import { AelinLogo } from '@/src/components/assets/Logo'
import { Metamask } from '@/src/components/assets/Metamask'
import { Optimism } from '@/src/components/assets/Optimism'
import ChangeWalletMenu from '@/src/components/common/ChangeWalletMenu'
import { Dropdown, DropdownItem, DropdownPosition } from '@/src/components/common/Dropdown'
import { Modal } from '@/src/components/common/Modal'
import { Notifications } from '@/src/components/common/Notifications'
import { TopMenu as BaseTopMenu } from '@/src/components/navigation/TopMenu'
import { ButtonPrimary } from '@/src/components/pureStyledComponents/buttons/Button'
import { ButtonDropdown as BaseButtonDropdown } from '@/src/components/pureStyledComponents/buttons/Button'
import { BaseCardCSS } from '@/src/components/pureStyledComponents/common/BaseCard'
import { InnerContainer as BaseInnerContainer } from '@/src/components/pureStyledComponents/layout/InnerContainer'
import { getChainsByEnvironmentArray, getNetworkConfig } from '@/src/constants/chains'
import { AELIN_APP_DEV_URL } from '@/src/constants/misc'
import { ThemeType } from '@/src/constants/types'
import { useThemeContext } from '@/src/providers/themeContextProvider'
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
    padding: 12px 15px 12px 15px;
  }

  @media (min-width: ${({ theme }) => theme.themeBreakPoints.desktopStart}) {
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

const Logo = styled(AelinLogo)`
  cursor: pointer;
  max-height: calc(var(--header-height) - 20px);

  @media (min-width: ${({ theme }) => theme.themeBreakPoints.tabletLandscapeStart}) {
    max-height: calc(var(--header-height) - 45px);
  }

  @media (min-width: ${({ theme }) => theme.themeBreakPoints.desktopStart}) {
    max-height: calc(var(--header-height) - 20px);
  }
`

const StartWrapper = styled.div`
  align-items: center;
  display: flex;
`

const HeaderDropdown = styled(Dropdown)`
  .dropdownItems {
    background-color: ${({ theme }) => theme.headerDropdown.backgroundColor};
    border-color: ${({ theme }) => theme.headerDropdown.borderColor};
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
  gap: 12px;
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

  @media (min-width: ${({ theme }) => theme.themeBreakPoints.desktopStart}) {
    gap: 20px;
  }
`

const TopMenu = styled(BaseTopMenu)`
  margin-left: auto;
  margin-right: 10px;

  @media (min-width: ${({ theme }) => theme.themeBreakPoints.desktopWideStart}) {
    margin-right: 30px;
  }
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
    background: ${({ theme }) => theme.header.lineColor};
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

export const CurrentChainShortName = styled.span`
  display: none;

  @media (min-width: ${({ theme }) => theme.themeBreakPoints.desktopWideStart}) {
    display: block;
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

const RedirectLink = styled.a`
  display: flex;
  gap: 10px;
  text-decoration: none;
`

export const Header: React.FC = (props) => {
  const {
    address = '',
    appChainId,
    connectWallet,
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
      {item.shortName}
    </DropdownItem>
  ))

  const networksRedirectItem = (
    <DropdownItem>
      <RedirectLink href={AELIN_APP_DEV_URL}>
        <NetworkPlaceholder name="T" />
        <>Testnet</>
      </RedirectLink>
    </DropdownItem>
  )

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
                      <CurrentChainShortName data-cy="selected-network">
                        {currentChain.shortName}
                      </CurrentChainShortName>
                    </>
                  )}
                  <ChevronDown />
                </DropdownButton>
              }
              dropdownPosition={DropdownPosition.center}
              items={[...networksDropdownItems, networksRedirectItem]}
            />
            {isWalletConnected && (
              <>
                <Line />
                <WalletDropdown
                  dropdownButtonContent={
                    <DropdownButton>
                      <Metamask />
                      {address && <Item data-cy="wallet-btn">{shortenAddress(address)}</Item>}
                      <ChevronDown />
                    </DropdownButton>
                  }
                  dropdownPosition={DropdownPosition.center}
                  items={[<ChangeWalletMenu key={'wallet_dopdown'} />]}
                />
                <Line />
                <Notifications />
              </>
            )}
            {!isWalletConnected && (
              <>
                <Line />
                <ButtonPrimary data-cy="connect-btn" onClick={connectWallet}>
                  Connect
                </ButtonPrimary>
              </>
            )}
            <Line />
            <HeaderDropdown
              activeItemHighlight={false}
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
                  href="https://app.uniswap.org/#/swap?outputCurrency=0xa9c125bf4c8bb26f299c00969532b66732b1f758&inputCurrency=ETH&chain=mainnet"
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
                    {currentChain.shortName}
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
