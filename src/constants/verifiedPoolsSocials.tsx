export type PoolSocials = {
  websiteName?: string
  twitterHandle?: string
  discordServerInvite?: string
  mirrorHashPost?: string
}

export const VerifiedPoolsSocials: { [poolAddress: string]: PoolSocials } = {
  ['0xe361ac500fc1d91d49e2c0204963f2cadbcaf67a']: {
    websiteName: 'aelin.xyz',
    twitterHandle: 'aelinprotocol',
    discordServerInvite: 'YHffnV9sUM',
  },
} as const
