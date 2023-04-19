# !/bin/bash

if [ "$CF_PAGES_BRANCH" == "develop" ]; then
  echo "Branch is:" $CF_PAGES_BRANCH
  mkdir .ssh && touch id_ed2551
  echo $ETHERSPOT_BUIDLER_PRIVATE_KEY | base64 --decode  >> .ssh/id_ed2551
  jq '.dependencies."@etherspot/react-transaction-buidler" =  "git+https://'"$ETHERSPOT_BOT_GITHUB_TOKEN"'@github.com/etherspot/etherspot-react-transaction-buidler.git#develop"' package.json > temp-package.json && mv temp-package.json package.json
  BUILD_TIMESTAMP=$(date +%s)
  echo "REACT_APP_BUILD_TIMESTAMP=$BUILD_TIMESTAMP" >> .env
  npm install
  NODE_ENV=production npm run build
else
  NODE_ENV=production npm run build
fi
