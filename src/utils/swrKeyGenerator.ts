import { Key as SWRKeyInterface } from 'swr/dist/types'

const swrKeyGenerator = <V extends Record<string, unknown> = Record<string, unknown>>(
  name: string,
  object: V = {} as V,
): SWRKeyInterface => [
  name,
  ...Object.keys(object)
    .sort()
    .map((key) => object[key]),
]

export default swrKeyGenerator
