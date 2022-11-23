# !/bin/bash
echo "Running pre-install script"
jq '.dependencies."@etherspot/react-transaction-buidler" =  "etherspot/etherspot-react-transaction-buidler#develop"' package.json > temp-package.json && mv temp-package.json package.json