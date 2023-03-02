FROM alpine:3.14

RUN apk update && apk add bash

WORKDIR /app

COPY ./ci/add-envs.sh ./


ENTRYPOINT ["/bin/bash", "-c"]