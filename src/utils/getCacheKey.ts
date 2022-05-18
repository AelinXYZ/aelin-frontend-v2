import { BigNumberish } from '@ethersproject/bignumber'

export type CacheKey<T extends any[]> = {
  [Key in keyof T]: T[Key] extends null ? undefined : T[Key] extends BigNumberish ? string : T[Key]
}

export default function getCacheKey<T extends any[]>(args: T): CacheKey<T> {
  const key = args.map((arg) => {
    if (arg === null || arg === undefined) {
      return 'null'
    } else {
      return arg.toString()
    }
  })
  return key as CacheKey<T>
}
