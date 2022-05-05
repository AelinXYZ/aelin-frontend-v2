# Aelin Frontend v2

## Run this application with Node 14

1. Copy `.env.example` as `.env.local`

```
$ cp .env.example .env.local
```

2. Install dependencies

```
$ yarn
```

3. Auto generate generate contracts types, subgraph types & queries SDK

```
$ yarn postinstall
```

- NOTE: `postinstall` will generates an sdk file in `CODEGEN_OUTPUT_FILE` environment variable (default value: `types/generated/queries.ts` ) with all queries uses in the App.

4. Run application as dev mode

```
$ yarn dev
```

5. Open `http://localhost:3000`
