#!/usr/bin/env bash

if [ -f .env.local ]; then
  echo "Importing environment variables from .env.local"
  set -o allexport; source .env.local; set +o allexport
fi

SCHEMA_OUTPUT_FILE="types/subgraph/graphql-schema.json"
GENERATED_OUTPUT_FOLDER="types/subgraph/__generated__"

if [ -z $NEXT_PUBLIC_REACT_APP_SUBGRAPH_API ]
then
  echo "NEXT_PUBLIC_REACT_APP_SUBGRAPH_API must be set"
  exit 1
fi

npx apollo service:download --endpoint=$NEXT_PUBLIC_REACT_APP_SUBGRAPH_API $SCHEMA_OUTPUT_FILE

npx apollo codegen:generate --localSchemaFile=$SCHEMA_OUTPUT_FILE --target=typescript $GENERATED_OUTPUT_FOLDER --outputFlat --passthroughCustomScalars --customScalarsPrefix=Subgraph_
