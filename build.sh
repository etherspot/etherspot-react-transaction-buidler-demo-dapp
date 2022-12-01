# !/bin/bash

if [ "$CF_PAGES_BRANCH" == "develop" || "$CF_PAGES_BRANCH" == "feature/*" ]; then
  echo "Branch is:" $CF_PAGES_BRANCH
  mkdir .ssh && touch id_ed2551
  echo $ETHERSPOT_BUIDLER_PRIVATE_KEY | base64 --decode  >> .ssh/id_ed2551
  jq '.dependencies."@etherspot/react-transaction-buidler" =  "git+https://'"$ETHERSPOT_BOT_GITHUB_TOKEN"'@github.com/etherspot/etherspot-react-transaction-buidler.git#08adcb2fb6e0af9ecb9285f3c68c7b0934e573f8"' package.json > temp-package.json && mv temp-package.json package.json
#   npm install yarn -g
  npm install
  NODE_ENV=production npm run build
else
  NODE_ENV=production npm run build
fi
