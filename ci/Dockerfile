FROM synthetixio/docker-e2e:18.13-ubuntu as base

RUN apt install git

WORKDIR /app

COPY . .

RUN echo "NEXT_PUBLIC_GRAPH_ENDPOINT_GOERLI=https://api.thegraph.com/subgraphs/name/alextheboredape/aelin-goerli" > .env
RUN echo "NEXT_PUBLIC_GRAPH_ENDPOINT_OPTIMISM=https://api.thegraph.com/subgraphs/name/alextheboredape/aelin-optimism" > .env

RUN yarn install --frozen-lockfile