export type PoolSocials = {
  websiteName?: string
  twitterHandle?: string
  discordServerInvite?: string
  mirrorHashPost?: string
  mediumPost?: string
}

export const VerifiedPoolsSocials: { [poolAddress: string]: PoolSocials } = {
  ['0xe361ac500fc1d91d49e2c0204963f2cadbcaf67a']: {
    websiteName: 'aelin.xyz',
    twitterHandle: 'aelinprotocol',
    discordServerInvite: 'YHffnV9sUM',
  },
  ['0x21f4f88a95f656ef4ee1ea107569b3b38cf8daef']: {
    websiteName: 'kwenta.eth.limo',
    twitterHandle: 'kwenta_io',
    mirrorHashPost: 'kwenta.eth/bM-hUzw9fzxTom3k8Is_HbkVJ4My3XzamHthA0Lp7KI',
  },
  ['0xd5541dad40ee8e9357606e409d9d3530c0696ede']: {
    twitterHandle: 'HallsofOlympia',
    discordServerInvite: 'mQW7UVV6zt',
    mediumPost: '@HallsofOlympia/were-going-aelin-13b5eca35eef',
  },
  ['0xc4b35b8bb40368996add8bfc954e3f16579ae82b']: {
    websiteName: 'thalon.io',
    twitterHandle: 'thalondao',
    discordServerInvite: 'BfntecmA',
    mediumPost: '@thalondao/28995c707e23',
  },
} as const
