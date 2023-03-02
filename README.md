# Aelin Frontend

![Build](https://img.shields.io/github/actions/workflow/status/AelinXYZ/aelin-frontend-v2/ci.yml?branch=main) [![Discord](https://img.shields.io/discord/880914235444572210?logo=discord&logoColor=ffffff&color=7389D8&labelColor=6A7EC2)](https://discord.gg/zxSwN8Z) [![Twitter Follow](https://img.shields.io/twitter/follow/aelinprotocol?style=social)](https://twitter.com/aelinprotocol)

<p align="center">
  <img height="350" src="https://github.com/AelinXYZ/aelin-frontend-v2/blob/add/new-readme/media/homepage.png?raw=true" alt="Homepage"/>
</p>

Aelin is a dApp enabling protocols to leverage their communities for funding through permissionless multi-chain capital raises and OTC deals

## Tech stack

- React
- Next.js
- Typescript
- GraphQL
- Styled-Components
- IPFS (web3.storage)

## Contributing

We are a community-driven and open-source project. Aelin welcomes contributors to submit their contributions by forking, fixing, committing, and creating a pull request that describes their work in detail. For more information, please refer to the [Contribution guidelines](CONTRIBUTING.md).

## Development

### Requeriments

- Node LTS
- Yarn

### Getting Started

#### Set up environment variables

Copy `.env.example` as `.env.local`

```bash
cp .env.example .env.local
```

Then, open `.env.local` and add the missing environment variables:

Required:

- `NEXT_PUBLIC_GOERLI_TOKEN_PROVIDER=get-alchemy-api-key`

#### Install dependencies

```bash
yarn
```

#### Auto generate generate contracts types, subgraph types & queries SDK

```bash
yarn postinstall
```

Note `postinstall` will generates an sdk file in `CODEGEN_OUTPUT_FILE` environment variable (default value: `types/generated/queries.ts` ) with all queries uses in the App.

#### Run

```bash
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

#### Build

```bash
yarn build
yarn start
```

#### Unit Testing

```bash
yarn test
```

#### End to End Testing

You can follow the instructions in the [E2E testing guide](TESTING.md) to learn how to set it up and run the tests locally.

## Contact

Join the community on the [Aelin Discord server](https://discord.gg/vNkXAeZpuU)!
