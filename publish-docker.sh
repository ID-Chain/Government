#!/usr/bin/env bash

set -e

docker login
VERSION=`cat ./.dockerHubVersion`
echo "Next Version? (current: "${VERSION}")"
read nversion
echo "Let's build new image with tag: idchain/legacy-government:"${nversion}
docker build . -t idchain/legacy-government:${nversion}
docker push idchain/legacy-government:${nversion}
echo ${nversion} > ./.dockerHubVersion

git add ./.dockerHubVersion
msg=`echo New legacy-government image release version: ${nversion}`
echo ${msg}
git commit -m "$msg"
git push
