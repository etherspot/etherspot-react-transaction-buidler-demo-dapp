# !/bin/bash

if [ "$CF_PAGES_BRANCH" == "develop" ]; then
  echo "Branch is:" $CF_PAGES_BRANCH
  mkdir .ssh && touch id_ed2551
  echo $ETHERSPOT_BUIDLER_PRIVATE_KEY | base64 --decode  >> .ssh/id_ed2551
  jq '.dependencies."@etherspot/react-transaction-buidler" =  "git+https://'"$ETHERSPOT_BOT_GITHUB_TOKEN"'@github.com/etherspot/etherspot-react-transaction-buidler.git#develop"' package.json > temp-package.json && mv temp-package.json package.json
#   npm install yarn -g
  npm install
  npm run build
else
  npm run build
fi