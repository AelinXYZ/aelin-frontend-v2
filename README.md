# Aelin Frontend v2

### Run this application with Node 14

1. Install dependencies
```
$ yarn 
```
2. Copy `.env.example` as `.env.local`
```
$ cp .env.example .env.local
```
3. Run application as dev mode
```
$ yarn dev
```
4. Open `http://localhost:3000`

### Auto generate contracts types
```
$ yarn typechain
```
### Auto generate subgraph types
```
$ yarn schema
```
Note: you need a valid `NEXT_PUBLIC_REACT_APP_SUBGRAPH_API` env variable value 