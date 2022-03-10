// eslint-disable-next-line @typescript-eslint/no-var-requires,import/no-extraneous-dependencies
const { loadEnvConfig } = require('@next/env')
loadEnvConfig(process.cwd())

module.exports = {
  overwrite: true,
  schema: [
    process.env.GRAPH_ENDPOINT_MAINNET,
    process.env.GRAPH_ENDPOINT_OPTIMISM,
    process.env.GRAPH_ENDPOINT_KOVAN,
    process.env.GRAPH_ENDPOINT_GOERLI,
  ],
  documents: 'src/queries/**/*.ts',
  generates: {
    'types/generated/subgraph-queries.ts': {
      plugins: [
        'typescript',
        'typescript-operations',
        'typescript-graphql-request',
        'plugin-typescript-swr',
      ],
    },
  },
  config: {
    rawRequest: false,
    // excludeQueries:
    // useSWRInfinite:
    autogenSWRKey: true,
  },
}
