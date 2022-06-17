import { parseBytes32String } from '@ethersproject/strings'

export const parsePoolName = (name: string) => {
  const poolName = name.slice(name.indexOf('-') + 1)

  if (poolName.length === 66 && poolName.includes('0x')) {
    return parseBytes32String(poolName)
  }

  return poolName
}

export const parseDealName = (name: string) => parsePoolName(name)
