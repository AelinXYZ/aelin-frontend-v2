# Contributing to the Aelin Frontend

## devDAO

Aelin is a permissionless multi-chain protocol for capital raises and OTC deals. Through Aelin, protocols can use their communities to access funding. We are community-driven and welcome anyone to contribute. Our goal is to provide a constructive, respectful, and enjoyable environment for collaboration. If you'd like to help out, join the Aelin devDAO in our Discord server.

## Introduction

In order to maintain a simple and straightforward process for contributing to the Aelin Frontend, this document serves to establish standards and guidelines for the structure of the codebase and the interaction between various components. By adhering to these guidelines, devDAO contributors can ensure consistency and coherence throughout the project, facilitating collaboration and making it easier to maintain and scale the Aelin Frontend.

## How to contribute?

We operate as any other open source project, you will find our Issues and Pull Requests in our Github repository. We use Discord to chat, post, and distribute tickets to community members.

### Issues Assignment

To ensure alignment between Aelin's objectives and the developers who wish to contribute to the project through devDAO, Core Contributors will be responsible for creating Github issues. These issues will be labelled with the `devdao` badge for easy recognition. The ticket assignments will be handled in Discord, so it is important to check there before beginning work on an issue to avoid duplication of effort. This will help to maximize efficiency and prevent any unnecessary overlap in contributions.

### Pull Request Review Process

Aelin CCs will review pull requests submitted by devDAO contributors and provide feedback on what each CC believes is best to ensure the scalability and stability of the project. It is desirable that if you have any questions about how to think of a new solution, ask the CCs, they will give you enough insight to help you take the right direction. Once a PR is merged, a reward will be sent to you for helping to improve the Aelin Frontend.

### Issues Bounty

Once a pull request is merged, a bounty can be paid. To ensure that you have the opportunity to earn the bounty, it's crucial that you participate via the devDAO section of our Discord. If you submit a pull request without having been selected for the bounty, your PR will not receive a reward.

## Technical Details

### Requirements

To start developing, it is recommended that you have a Node.js version manager installed in order to install the LTS version. One of the package managers that you can use is "n" (https://www.npmjs.com/package/n). We recommend following the instructions on its GitHub page to install "n" based on your operating system. Once you have installed `n`, you can run the command `n lts` to install the latest stable version of Node.js. You will also need to have Yarn installed, you can install it from the official website: https://yarnpkg.com/getting-started/install.

### First-time Set-up

First-time contributors can get their git environment up and running with these steps:

1- Create a fork and clone it to your local machine.

2- Add an "upstream" branch that tracks the Aelin Frontend repository using $ git remote add upstream https://github.com/AelinXYZ/aelin-frontend-v2.git (pro-tip: use SSH instead of HTTPS).

3- Create a new feature branch with $ git checkout -b your_feature_name. The name of your branch isn't critical but it should be short and instructive. We recommend to use the git flow approach

4- Make sure you sign your commits. See the relevant doc. Commit your changes and push them to your fork with $ git push origin your_feature_name.

### How to run the project?

To get started, the first thing you'll need to do is clone the project. You can follow the steps outlined in the previous section to do this. Once you have successfully cloned the project, you should create a `.env.local` file. You can generate this file using the `.env.example` file. To simplify this step, you can use the following command: `cp .env.example .env.local`.

For most tasks, you will only need to create an Alchemy account and obtain the API_KEY for the Goerli environment, which is currently the development environment. Once you have obtained the API KEY, you can override the environment variable as follows:

`NEXT_PUBLIC_GOERLI_TOKEN_PROVIDER=your-api-key`

After this step, you can install all of the project dependencies by running the command `yarn install`. Additionally, we use typechain and codegen to automatically generate various types, GraphQL queries, and mutations. In order to generate these files, run the command `yarn postinstall`.

Finally, to start the application, you can use one of two commands:

- `yarn dev`: to run the application in development mode
- `yarn dev:prod`: to run the application in production mode.

Note that if you run `yarn dev:prod`, you will need to obtain the Alchemy API_KEY for the other networks that Aelin has launched in order to override the other environment variables.
