import React, { useMemo } from 'react'

import { SectionIntro } from '@/src/components/section/SectionIntro'
import { useWeb3Connection } from '@/src/providers/web3ConnectionProvider'

const StakeBanner = ({ ...restProps }) => {
  const { appChainId } = useWeb3Connection()

  const bannerPerChain = useMemo(
    () => ({
      1: {
        backgroundImage: 'bg-stake.svg',
        button: {
          onClick: () =>
            window.open(
              'https://app.uniswap.org/#/add/v2/0xa9c125bf4c8bb26f299c00969532b66732b1f758/ETH?chain=mainnet',
              '_blank',
            ),
          title: 'Go to Uniswap',
        },
        title: 'Stake',
        description: (
          <>
            Aelin Tokenholders can stake their AELIN or AELIN/ETH liquidity tokens to receive
            inflationary reward, deal fees, and governance voting power. Read more about the
            benefits of staking Aelin{' '}
            <a href="https://docs.aelin.xyz/general-info/staking" rel="noreferrer" target="_blank">
              here
            </a>
            .
            <br />
            <br />
            To obtain UNI-V2 AELIN/ETH LP tokens, first provide liquidity into the AELIN/ETH pool on
            Uniswap.
          </>
        ),
      },
      10: {
        backgroundImage: 'bg-stake.svg',
        button: {
          onClick: () =>
            window.open(
              'https://beta.arrakis.finance/#/vaults/0x665d8D87ac09Bdbc1222B8B9E72Ddcb82f76B54A',
              '_blank',
            ),
          title: 'Go to Arrakis.Finance',
        },
        description: (
          <>
            Aelin Tokenholders can stake their AELIN or AELIN/ETH liquidity tokens to receive
            inflationary reward, deal fees, and governance voting power. Read more about the
            benefits of staking Aelin{' '}
            <a href="https://docs.aelin.xyz/general-info/staking" rel="noreferrer" target="_blank">
              here
            </a>
            .
            <br />
            <br />
            To obtain G-UNI AELIN/ETH LP tokens, first provide liquidity into the AELIN/ETH pool on
            Uniswap via Arrakis.Finance. A full tutorial can be found on our blog{' '}
            <a
              href="https://mirror.xyz/aelingov.eth/vWMW887qout1flAyGJZ0mPJdpfrdaPSQeRt9X6cQqkQ"
              rel="noreferrer"
              target="_blank"
            >
              here
            </a>
            .
          </>
        ),
        title: 'Stake',
      },
      5: {
        backgroundImage: 'bg-pools.svg',
        title: 'Feature not available',
        description: `Staking is not available on test networks.`,
      },
      42: {
        backgroundImage: 'bg-pools.svg',
        title: 'Feature not available',
        description: `Staking is not available on test networks.`,
      },
    }),
    [],
  )

  const banner = bannerPerChain[appChainId]

  return (
    <SectionIntro
      backgroundImage={`resources/svg/${banner.backgroundImage}`}
      button={'button' in banner ? banner.button : undefined}
      title={banner.title}
      {...restProps}
    >
      {banner.description}
    </SectionIntro>
  )
}

export default StakeBanner
