FROM node:16-alpine

RUN apk add --no-cache libc6-compat git bash

WORKDIR /app

COPY . .

RUN echo "NEXT_PUBLIC_GRAPH_ENDPOINT_GOERLI=https://api.thegraph.com/subgraphs/name/alextheboredape/aelin-goerli" > .env
RUN echo "NEXT_PUBLIC_GRAPH_ENDPOINT_OPTIMISM=https://api.thegraph.com/subgraphs/name/alextheboredape/aelin-optimism" > .env

RUN yarn install --frozen-lockfile

ENTRYPOINT ["/bin/bash", "-c"]