#!/bin/bash

docker-compose down --remove-orphans && docker volume prune -f && docker-compose up --build

