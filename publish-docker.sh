#!/usr/bin/env bash

set -e

docker login
VERSION=`cat ./.dockerHubVersion`
echo "Next Version? (current: "${VERSION}")"
read nversion
echo "Let's build new image with tag: idchain/admin-ui:"${nversion}
docker build . -t idchain/admin-ui:${nversion}
docker push idchain/admin-ui:${nversion}
echo ${nversion} > ./.dockerHubVersion

git add ./.dockerHubVersion
msg=`echo New admin-ui image release version: ${nversion}`
echo ${msg}
git commit -m "$msg"
git push
