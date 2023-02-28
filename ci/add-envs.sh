#!/bin/bash

file_path="/usr/share/envs/.env.linuz"

while [ ! -f $file_path ]
do
  echo "Waiting for file $file_path to exist..."
  sleep 1
done

echo "Exporting ENVs for Aelin UI..."

NEXT_PUBLIC_AELIN_POOL_FACTORY=$(grep AelinPoolFactory_address /usr/share/envs/.env.linuz | tail -1 | awk -F "=" '{print $2}')
NEXT_PUBLIC_AELIN_DEAL_FACTORY=$(grep AelinUpFrontDealFactory_address /usr/share/envs/.env.linuz | tail -1 | awk -F "=" '{print $2}')
NEXT_PUBLIC_UNI=$(grep UNI_address /usr/share/envs/.env.linuz | tail -1 | awk -F "=" '{print $2}')
NEXT_PUBLIC_USDC=$(grep USDC_address /usr/share/envs/.env.linuz | tail -1 | awk -F "=" '{print $2}')
NEXT_PUBLIC_WETH=$(grep WETH_address /usr/share/envs/.env.linuz | tail -1 | awk -F "=" '{print $2}')

echo "
CODEGEN_OUTPUT_FILE=types/generated/queries.ts
NEXT_PUBLIC_AELIN_VOUCHER_ENS_ADDRESS=aelincouncil.eth
NEXT_PUBLIC_GRAPH_ENDPOINT_MAINNET=https://api.thegraph.com/subgraphs/name/alextheboredape/aelin-mainnet
NEXT_PUBLIC_GRAPH_ENDPOINT_OPTIMISM=https://api.thegraph.com/subgraphs/name/alextheboredape/aelin-optimism
NEXT_PUBLIC_GRAPH_ENDPOINT_ARBITRUM=https://api.thegraph.com/subgraphs/name/alextheboredape/aelin-arbitrum
NEXT_PUBLIC_GRAPH_ENDPOINT_POLYGON=https://api.thegraph.com/subgraphs/name/alextheboredape/aelin-polygon
NEXT_PUBLIC_IPFS_GATEWAY_BASE_URL=https://w3s.link/ipfs
NEXT_PUBLIC_MAINTENANCE_MESSAGE_SUBTITLE=undefined
NEXT_PUBLIC_MAINTENANCE_MESSAGE_TITLE=undefined
NEXT_PUBLIC_MAINTENANCE_MODE=false
QUIXOTIC_API_TOKEN=ask
SIMPLEHASH_API_KEY=ask
STRATOS_API_TOKEN=ask
NEXT_PUBLIC_ARBITRUM_TOKEN_PROVIDER=ask
NEXT_PUBLIC_GOERLI_TOKEN_PROVIDER=ask
NEXT_PUBLIC_OPTIMISM_TOKEN_PROVIDER=ask
NEXT_PUBLIC_POLYGON_TOKEN_PROVIDER=ask
NEXT_PUBLIC_WEB3_STORAGE_TOKEN_KEY=ask
NEXT_PUBLIC_APP_NAME=Aelin
NEXT_PUBLIC_APP_ENV=development
NEXT_PUBLIC_REACT_APP_DEFAULT_CHAIN_ID=5
NEXT_PUBLIC_APP_URL=https://app.aelin.xyz
NEXT_PUBLIC_APP_NAME=aelin
NEXT_PUBLIC_EMAIL_CONTACT=eaae@aza.com
NEXT_PUBLIC_GRAPH_ENDPOINT_GOERLI=http://0.0.0.0:8000/subgraphs/name/0xlinus/boot-node-goerli
NEXT_PUBLIC_ETH_GAS_STATION_API_URL=https://ethgasstation.info/json/ethgasAPI.json
NEXT_PUBLIC_GAS_NOW_API_URL=https://etherchain.org/api/gasnow
NEXT_PUBLIC_AELIN_POOL_FACTORY=${NEXT_PUBLIC_AELIN_POOL_FACTORY}
NEXT_PUBLIC_AELIN_DEAL_FACTORY=${NEXT_PUBLIC_AELIN_DEAL_FACTORY}
NEXT_PUBLIC_UNI=${NEXT_PUBLIC_UNI}
NEXT_PUBLIC_USDC=${NEXT_PUBLIC_USDC}
NEXT_PUBLIC_WETH=${NEXT_PUBLIC_WETH}
NEXT_PUBLIC_ANVIL=http://0.0.0.0:8545
PRIVATE_KEY=0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80
NETWORK_NAME=goerli
" >> .env
