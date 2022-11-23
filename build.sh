# !/bin/bash

if [ "$CF_PAGES_BRANCH" == "develop" ]; then
  jq '.dependencies."@etherspot/react-transaction-buidler" =  "etherspot/etherspot-react-transaction-buidler#develop"' package.json > temp-package.json && mv temp-package.json package.json
  npm run build
else
  npm run build
fi