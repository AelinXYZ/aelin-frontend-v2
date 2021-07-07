# UI dev stack for BN

> This document is a collection of all the best practices that we think will work better for us to speed-up project development.
>
> We probably may consider creating our own [example](https://github.com/vercel/next.js/tree/canary/examples) for web3-development

## Base project setup

### Create nextJS project with TS and cd into the recently created project
```
$ npx create-next-app --ts <project-name>
$ cd <project-name>
```


### ESLint
By default, next, since v11.0.0 brings with ESLint integrated and a set of useful configs: https://nextjs.org/docs/basic-features/eslint#core-web-vitals

1. Add `lint:fix` script to `package.json`
    ```json
    {
      "scripts": {
        "lint:fix": "npm run lint -- --fix"
      }
    }
    ```

2. If you need to add other directory than `pages`, `components`, and `libs`, modify the `lint` script to include it:
    ```json
    {
      "scripts": {
        "lint": "next lint -- -d pages -d components -d lib -d a_new_directory"
      }
    }
    ```

### Prettier
1. Install prettier dependencies
   ```
   $ yarn add -D prettier eslint-config-prettier eslint-plugin-prettier
   ```

2. Integrate Prettier with ESLint by adding it to `.eslintrc`
    ```json
    {
      "extends": ["next", "next/core-web-vitals", "prettier", "plugin:prettier/recommended"]
    }
    ```

3. Create `.prettierrc` with the following content
    ```json
    {
      "printWidth": 100,
      "semi": false,
      "singleQuote": true
    }
    ```

4. Copy `.gitignore` to `.prettierignore`
    ```
    $ cp .gitignore .prettierignore
    ```

### Connection
#### SWR (stale-while-revalidate)
_For more info, and usage examples, go to the SWR page: https://swr.vercel.app/_
1. Install
    ```
    $ yarn add swr
    ```

#### Alternative: react-query (https://react-query.tanstack.com/comparison)
_For more info, and usage examples, go to the React-Query page: https://react-query.tanstack.com/overview_ 
1. Install
    ```
    $ yarn add react-query
    ```

### Styles
#### Styled Components
1. Install
    ```
    $ yarn add styled-components sanitize.css polished
    $ yarn add -D @types/styled-components
   ```
2. SSR with Next: https://styled-components.com/docs/advanced#nextjs
   1. install babel plugin
   ```
   $ yarn add -D babel-plugin-styled-components
   ```
   2. create `.babelrc` file, with the following content
   ```json
   {
      "presets": ["next/babel"],
      "plugins": [["styled-components", { "ssr":  true }]]
   }
   ```
   3. Update the `_document.ts` file by following: https://github.com/vercel/next.js/blob/master/examples/with-styled-components/pages/_document.js
   1. optionally add babel plugin for `polished`
       1.
        ```
        $ npm i -D babel-plugin-polished
        ```
       2. `.babelrc`
        ```json
        {
          "plugins": ["polished"]
        }
        ```
3. Create a declarations file and theme (https://styled-components.com/docs/api#create-a-declarations-file)
    1. create `styled.d.ts` file in project root directory
       ```
        $ touch styled.d.ts
        ```
    2. extend `DefaultTheme` to match the project needs
        ```ts
        import 'styled-components'
        
        declare module 'styled-components' {
          export interface DefaultTheme {
            borderRadius: string;
            
            colors: {
              main: string;
              secondary: string;
            }
          }
        }

        ```
    3. create project theme `my-theme.ts`
        ```ts
        import { DefaultTheme } from 'styled-components'
       
        export const myTheme: DefaultTheme = {
          borderRadius: '5px',
        
          colors: {
            main: 'cyan',
            secondary: 'magenta',
          }
        }
       
        ```
#### Tailwind
1. Install
```
$ yarn add -D tailwindcss@latest postcss@latest autoprefixer@latest
```
2. Create `tailwind.config.js` and `postcss.config.js` files:
```
$ npx tailwindcss init -p
```
3. Configure tailwind (`tailwind.config.js`) to remove unused styles in production
```js
module.exports = {
  purge: ['./pages/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}'],
}
```
4. Follow all the other steps and personalization in the official website: https://tailwindcss.com/docs/guides/nextjs

### App state (xState)
https://github.com/vercel/next.js/tree/master/examples/with-xstate
https://xstate-catalogue.com/

### Web3

### Forms
- Wallet connection
- web3 (Web3js or Ethersjs)
- helpers:
    - Image (next/image)
    - infinite scroll
    - nullthrows
    - tiny-invariant
