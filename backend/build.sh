#!/bin/bash -eu

rm -rf node_modules
# npm i
# npm run build
# npm prune --production
yarn
yarn lint
yarn run build -- --config nest-cli.serverless.json
yarn --production
# pnpm i
# pnpm run build
# pnpm prune --prod
rm -rf lambda-deploy-package
mkdir lambda-deploy-package
cp -R dist lambda-deploy-package
cp -R node_modules lambda-deploy-package
# npm run start:prod
node dist/src/entrypoint/serverless.js
# pnpm run start:prod