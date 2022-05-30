## How to add new netowork on Aelin?
Needs: 

* Subgraph endpoint of the new network (must be the same schema of the others networks!)
* New network icon
* New network contracts address (AELIN_TOKEN, POOL_CREATE, STAKING_REWARDS, LP_TOKEN, LP_STAKING_REWARDS, GELATO_POOL contracts)
* Buy aelin url for the new network
* rpcUrl for the new network (infura, alchemy, etc...)
* Is L2 network?
* Block explorer url (like etherscan.io)


### Open `.env` file and adding the new variable of the network subgraph:

```` 
NEXT_PUBLIC_GRAPH_ENDPOINT_{new_network}=https://api.thegraph.com/subgraphs/....
````

### Adding the new network configuration:
Open `src/constants/config/chains.tsx`
* Add new network ID in Chains const (line 9):
````js
export const Chains = {
    mainnet: 1,
    goerli: 5,
    kovan: 42,
    optimism: 10,
    ...
    // add new network here
    new_network_name: new_network_id
} as const
````
* Add new network icon in `@/src/components/assets/`

* Then, add the new network configuration in `chainsConfig` const:
````js
[Chains.new_network_name]: {
    blockExplorerUrls: ['https://newnetworkscan.io/'],
    chainId: Chains.new_network_id,
    id: Chains.new_network_id,
    chainIdHex: '0x0',
    icon: <NewNetworkIcon />, // Import the previously added icon in this file and use them here 
    iconUrls: [],
    isProd: true, // Is production network?
    name: 'New network long name',
    rpcUrl: ``, // RPC url (alchemy, infura, etc)
    shortName: 'New network short name',
    tokenListUrl: 'https://...', // The token list URL
    buyAelinUrl:
      '', // Where can I Buy aelin tokens in the new network?
  },
````

### Adding the Query SDK of the new network.
   1. Edit `src/constants/config/gqlSdkByNetwork.ts` file adding the new network in `allSDK` const
````js

export const gqlGqlSdkByNetwork: AllSDK = {
  [Chains.mainnet]: getSdkWithHooks(
    new GraphQLClient(process.env.NEXT_PUBLIC_GRAPH_ENDPOINT_MAINNET || ''),
  ),
  [Chains.goerli]: getSdkWithHooks(
    new GraphQLClient(process.env.NEXT_PUBLIC_GRAPH_ENDPOINT_GOERLI || ''),
  ),
  [Chains.kovan]: getSdkWithHooks(
    new GraphQLClient(process.env.NEXT_PUBLIC_GRAPH_ENDPOINT_KOVAN || ''),
  ),
  [Chains.optimism]: getSdkWithHooks(
    new GraphQLClient(process.env.NEXT_PUBLIC_GRAPH_ENDPOINT_OPTIMISM || ''),
  ),
  ...
  [Chains.new_network_name]: getSdkWithHooks(
    new GraphQLClient(process.env.NEXT_PUBLIC_GRAPH_ENDPOINT_{new_network} || ''),
  ),
}

````

### Configure contracts for the new network
Edit `src/constants/config/contracts.ts` file adding the contracts of the new network:
````js

AELIN_TOKEN: {
    address: {
      [Chains.mainnet]: '0xa9C125BF4C8bB26f299c00969532B66732b1F758',
      [Chains.kovan]: '0x61BAADcF22d2565B0F471b291C475db5555e0b76',
      [Chains.goerli]: '',
      [Chains.optimism]: '0x61BAADcF22d2565B0F471b291C475db5555e0b76',
      ...
      [Chains.new_network_name]: '0x00000000000000000000000000000000000',
    },
    abi: ERC20,
},
POOL_CREATE: {
    address: {
      [Chains.mainnet]: '0x2C0979B0de5F99c2bde1E698AeCA13b55695951E',
      [Chains.kovan]: '0x3347b7C7F491B4cD665656796614A729036Ff220',
      [Chains.goerli]: '0xCA4d64B67486867a9E867D0E38E1F1e99B718EEb',
      [Chains.optimism]: '0x9219f9f65B007Fd3bA0b53762861f54062531a31',
      ...
      [Chains.new_network_name]: '0x00000000000000000000000000000000000',
    },
    abi: AelinPoolCreateABI,
},
...
// And all others contracts used in the app

````

