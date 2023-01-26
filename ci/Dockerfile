FROM node:16-alpine

RUN apk add --no-cache libc6-compat git

WORKDIR /app

COPY . .

RUN yarn install --frozen-lockfile

CMD [ "yarn", "dev" ]