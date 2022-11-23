# !/bin/bash

if [ "$CF_PAGES_BRANCH" == "develop" ]; then
  echo "Branch is:" $CF_PAGES_BRANCH
  git config --global url."https://".insteadOf ssh://
  jq '.dependencies."@etherspot/react-transaction-buidler" =  "git+https://'"$ETHERSPOT_BOT_GITHUB_TOKEN}"'@github.com/etherspot/etherspot-react-transaction-buidler.git#develop"' package.json > temp-package.json && mv temp-package.json package.json
  npm install
  npm run build
else
  npm run build
fi