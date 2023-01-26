#!/bin/bash

echo "Exporting ENVs for Aelin UI..."

NEXT_PUBLIC_AELIN_POOL_FACTORY=$(grep AelinPoolFactory_address /usr/share/.env.linuz | tail -1 | awk -F "=" '{print $2}')
NEXT_PUBLIC_AELIN_DEAL_FACTORY=$(grep AelinUpFrontDealFactory_address /usr/share/.env.linuz | tail -1 | awk -F "=" '{print $2}')
NEXT_PUBLIC_UNI=$(grep UNI_address /usr/share/.env.linuz | tail -1 | awk -F "=" '{print $2}')
NEXT_PUBLIC_USDC=$(grep USDC_address /usr/share/.env.linuz | tail -1 | awk -F "=" '{print $2}')

echo "
NEXT_PUBLIC_APP_NAME=Aelin
NEXT_PUBLIC_APP_ENV=development
NEXT_PUBLIC_REACT_APP_DEFAULT_CHAIN_ID=5
NEXT_PUBLIC_APP_URL=app.aelin.xyz
NEXT_PUBLIC_APP_NAME=aelin
NEXT_PUBLIC_EMAIL_CONTACT=eaae@aza.com
NEXT_PUBLIC_MAINNET_TOKEN_PROVIDER=EW9N4oDCQJ58k_9wF-wG8pkq7amdPnqD
NEXT_PUBLIC_GRAPH_ENDPOINT_GOERLI=http://0.0.0.0:8000/subgraphs/name/0xlinus/boot-node-goerli
NEXT_PUBLIC_ETH_GAS_STATION_API_URL=https://ethgasstation.info/json/ethgasAPI.json
NEXT_PUBLIC_GAS_NOW_API_URL=https://etherchain.org/api/gasnow
NEXT_PUBLIC_AELIN_POOL_FACTORY=${NEXT_PUBLIC_AELIN_POOL_FACTORY}
NEXT_PUBLIC_AELIN_DEAL_FACTORY=${NEXT_PUBLIC_AELIN_DEAL_FACTORY}
NEXT_PUBLIC_UNI=${NEXT_PUBLIC_UNI}
NEXT_PUBLIC_USDC=${NEXT_PUBLIC_USDC}
NEXT_PUBLIC_ANVIL=http://0.0.0.0:8545
" >> .env
