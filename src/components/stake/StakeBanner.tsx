import React, { useMemo } from 'react'

import { SectionIntro } from '@/src/components/common/SectionIntro'
import { useWeb3Connection } from '@/src/providers/web3ConnectionProvider'

const StakeBanner = ({ ...restProps }) => {
  const { appChainId } = useWeb3Connection()

  const sectionContents = useMemo(
    () =>
      appChainId === 1
        ? {
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
                <a
                  href="https://docs.aelin.xyz/general-info/staking"
                  rel="noreferrer"
                  target="_blank"
                >
                  here
                </a>
                .
                <br />
                <br />
                To obtain UNI-V2 AELIN/ETH LP tokens, first provide liquidity into the AELIN/ETH
                pool on Uniswap.
              </>
            ),
          }
        : appChainId === 10
        ? {
            backgroundImage: 'bg-stake.svg',
            button: {
              onClick: () =>
                window.open(
                  'https://www.sorbet.finance/#/pools/0x665d8D87ac09Bdbc1222B8B9E72Ddcb82f76B54A',
                  '_blank',
                ),
              title: 'Go to Sorbet.Finance',
            },
            description: (
              <>
                Aelin Tokenholders can stake their AELIN or AELIN/ETH liquidity tokens to receive
                inflationary reward, deal fees, and governance voting power. Read more about the
                benefits of staking Aelin{' '}
                <a
                  href="https://docs.aelin.xyz/general-info/staking"
                  rel="noreferrer"
                  target="_blank"
                >
                  here
                </a>
                .
                <br />
                <br />
                To obtain G-UNI AELIN/ETH LP tokens, first provide liquidity into the AELIN/ETH pool
                on Uniswap via Sorbet.Finance. A full tutorial can be found on our blog{' '}
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
          }
        : {
            backgroundImage: 'bg-pools.svg',
            title: 'Feature not available',
            description: `Staking is not available on test networks.`,
          },
    [appChainId],
  )

  return (
    <SectionIntro
      backgroundImage={`resources/svg/${sectionContents.backgroundImage}`}
      button={sectionContents.button}
      title={sectionContents.title}
      {...restProps}
    >
      {sectionContents.description}
    </SectionIntro>
  )
}

export default StakeBanner
