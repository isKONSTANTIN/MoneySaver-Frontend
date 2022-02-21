#!/bin/bash

echo "Pushing $BRANCH..."

cat ./pass | docker login https://dockreg.knst.su/ --username ms_push --password-stdin
docker build -t ms_frontend.$BRANCH .
docker tag ms_frontend.$BRANCH dockreg.knst.su/ms_frontend.$BRANCH
docker push dockreg.knst.su/ms_frontend.$BRANCH
