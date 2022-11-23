# !/bin/bash

if [ "$CF_PAGES_BRANCH" == "develop" ]; then
  echo "Branch is:" $CF_PAGES_BRANCH
  jq '.dependencies."@etherspot/react-transaction-buidler" =  "github:https://'"$ETHERSPOT_BOT_GITHUB_TOKEN}"'@github.com/etherspot/etherspot-react-transaction-buidler.git#develop"' package.json > temp-package.json && mv temp-package.json package.json
  yarn install
  yarn run build
else
  yarn run build
fi