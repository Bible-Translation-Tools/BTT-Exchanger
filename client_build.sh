#!/bin/bash

set -e
set -x

#Make script exit if there is no env set for STORE_PASSWORD. Jenkins sets this in during CI/CD. Prevents accidental script runs
if [ -z $STORE_PASSWORD ]; then exit
fi

export ANDROID_HOME=/home/jenkins

git clone https://github.com/WycliffeAssociates/translationExchange && git clone https://github.com/wycliffeassociates/translationExchangeAndroid

# Repo dir
cd ./translationExchange

docker run --rm -i \
--env-file <(env | grep -iE 'DEBUG|NODE_|ELECTRON_|YARN_|NPM_|CI|CIRCLE|TRAVIS_TAG|TRAVIS|TRAVIS_REPO_|TRAVIS_BUILD_|TRAVIS_BRANCH|TRAVIS_PULL_REQUEST_|APPVEYOR_|CSC_|GH_|GITHUB_|BT_|AWS_|STRIP|BUILD_') \
--env ELECTRON_CACHE="/root/.cache/electron" \
--env ELECTRON_BUILDER_CACHE="/root/.cache/electron-builder" \
-v ${PWD}:/project \
-v ${PWD##*/}-node-modules:/project/node_modules \
-v ~/.cache/electron:/root/.cache/electron \
-v ~/.cache/electron-builder:/root/.cache/electron-builder \
electronuserland/builder:wine \
/bin/bash -c "yarn && yarn dist"

rm -r ../translationExchangeAndroid/app/src/main/assets/build || exit 1

cp -r ./build ../translationExchangeAndroid/app/src/main/assets/

cd ../translationExchangeAndroid

docker run --rm -i \
-v ${PWD}:/project \
-v $TR_KEY:/key/translationRecorderKey.jks \
runmymind/docker-android-sdk:ubuntu-standalone \
/bin/bash -c "cd /project && ./gradlew -PkeystorePath=/key/translationRecorderKey.jks -PstorePass=$STORE_PASSWORD -PkeyPass=$KEY_PASSWORD assembleRelease"
