# Aelin UI - Local Dev Environment

## How it works

To be able to run Aelin and all its components locally we'll need:

1. **Blockchain node** with the latest Aelin contracts deployed
2. **Graph node** with the latest Aelin subgraphs deployed
3. **Aelin UI app** running

### Blockchain

We'll use **Anvil** for this, which is a ganache-style blockchain node implemented by **Foundry**. There's a script that will run before everything else, which will deploy all contracts and deps needed.

### Graph node

A simple graph node as shown [here](https://thegraph.academy/developers/local-development/)

### Aelin UI

The one in this repo.

## Steps

First run `yarn` and install all deps (check that there are no errors)

### 1 - Start Anvil + Subgraph + Deploy Contracts

```sh
. ./start-local.sh
```

### 3 - Use generated envs

You'll need new envs containing contracts, private keys (test net dont worry!), etc.
Run this command and then change `.env.generated` to `.env`

First you'll have to wait until all contracts are deployed and env variables are generated. Check `docker-compose` logs and wait until you start to see a lot of activity.

After that's done you're safe to export the generated envs:

```sh
docker cp anvil:/usr/share/envs/.env.generated ./.env.generated
```

### 3 - Start UI

```sh
yarn dev
```

> Alternatively you can use prod build. Test run will be much faster, but it requires to make new build manualy everytime when new changes were made:

```sh
yarn build
yarn start
```

### 4 - Run E2E test?

> step 3 required!

```sh
yarn e2e:local
```

## Metamask config

**Network**

You'll need to add the local blockchain we've just started.

![image](https://user-images.githubusercontent.com/99757679/217300010-2c434eab-b803-47b9-ad99-fed875a45223.png)

**Account**

Import a test account using the private key located in the `env.generated`

**IMPORTANT**

EVERY TIME your (re)start `docker-compose`, remember to reset Metamask account, otherwise you'll see an error due to block height miss match.

![image](https://user-images.githubusercontent.com/99757679/217300243-1ef40d2d-72e7-4a1e-b113-716625dbb0cd.png)

## Requirements

```sh
docker
docker-compose
```
