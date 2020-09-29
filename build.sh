#!/bin/bash

set -xe

#Make script exit if there is no env set for STORE_PASSWORD. Jenkins sets this in during CI/CD. Prevents accidental script runs
if [ -z $STORE_PASSWORD ]; then exit
fi

BASE_DIR="$(pwd)"
ANDROID_HOME=/home/jenkins
USERNUM="$(id -u):$(id -g)"
export USERNUM
export ANDROID_HOME
export BASE_DIR

#make clients and admintools dir for collecting the distributables
mkdir clients
mkdir admintools

#zip up the install folder for distribution
mv install BTT-Exchanger ; zip -r install.zip BTT-Exchanger ; mv BTT-Exchanger install

# CD to the frontend where the electron app lives
cd ./web/te-backend/tRecorderApi/frontend

# build the electron client app
docker run --rm -i \
--env-file <(env | grep -iE 'DEBUG|NODE_|ELECTRON_|YARN_|NPM_|CI|CIRCLE|TRAVIS_TAG|TRAVIS|TRAVIS_REPO_|TRAVIS_BUILD_|TRAVIS_BRANCH|TRAVIS_PULL_REQUEST_|APPVEYOR_|CSC_|GH_|GITHUB_|BT_|AWS_|STRIP|BUILD_') \
--env ELECTRON_CACHE="/root/.cache/electron" \
--env ELECTRON_BUILDER_CACHE="/root/.cache/electron-builder" \
-v ${PWD}:/project \
-v ~/.cache/electron:/root/.cache/electron \
-v ~/.cache/electron-builder:/root/.cache/electron-builder \
electronuserland/builder:wine \
/bin/bash -c "yarn && yarn dist && chown -R $USERNUM /project"

# remove the android copy of the electron artifacts
rm -r "$BASE_DIR/android-client/app/src/main/assets/build" || exit 1

#copy the newly built client electron artifacts to the android client folder
cp -r ./build "$BASE_DIR/android-client/app/src/main/assets/"

#copy client distributable binaries to clients folder so they're easy to find
cp ./dist/*.exe $BASE_DIR/clients/
cp ./dist/*.AppImage $BASE_DIR/clients/
cp ./dist/*.zip $BASE_DIR/clients/

#cd to android client and build the android client
cd "$BASE_DIR/android-client"

docker run --rm -i \
-v ${PWD}:/project \
-v $TR_KEY:/key/translationRecorderKey.jks \
runmymind/docker-android-sdk:ubuntu-standalone \
/bin/bash -c "cd /project && ./gradlew -PkeystorePath=/key/translationRecorderKey.jks -PstorePass=$STORE_PASSWORD -PkeyPass=$KEY_PASSWORD assembleRelease && chown -R $USERNUM /project"

#move the android client to clients folder
cp ./app/build/outputs/apk/release/app-release.apk $BASE_DIR/clients/

#cd to the admin client dir and build it
cd "$BASE_DIR/admin-client/common"

docker run --rm -i \
--env-file <(env | grep -iE 'DEBUG|NODE_|ELECTRON_|YARN_|NPM_|CI|CIRCLE|TRAVIS_TAG|TRAVIS|TRAVIS_REPO_|TRAVIS_BUILD_|TRAVIS_BRANCH|TRAVIS_PULL_REQUEST_|APPVEYOR_|CSC_|GH_|GITHUB_|BT_|AWS_|STRIP|BUILD_') \
--env ELECTRON_CACHE="/root/.cache/electron" \
--env ELECTRON_BUILDER_CACHE="/root/.cache/electron-builder" \
-v ${PWD}:/project \
-v ~/.cache/electron:/root/.cache/electron \
-v ~/.cache/electron-builder:/root/.cache/electron-builder \
electronuserland/builder:wine \
/bin/bash -c "yarn && yarn dist && chown -R $USERNUM /project"

# remove the android copy of the admin electron artifacts
rm -r "$BASE_DIR/admin-client/android/app/src/main/assets/build" || exit 1

#copy the newly built admin client electron artifacts to the android client folder
cp -r ./build "$BASE_DIR/admin-client/android/app/src/main/assets/"

cp ./dist/*.exe $BASE_DIR/admintools/
cp ./dist/*.AppImage $BASE_DIR/admintools/
cp ./dist/*.zip $BASE_DIR/admintools/

cd "$BASE_DIR/admin-client/android"

#build the android admin client
docker run --rm -i \
-v ${PWD}:/project \
-v $TR_KEY:/key/translationRecorderKey.jks \
runmymind/docker-android-sdk:ubuntu-standalone \
/bin/bash -c "cd /project && ./gradlew -PkeystorePath=/key/translationRecorderKey.jks -PstorePass=$STORE_PASSWORD -PkeyPass=$KEY_PASSWORD assembleRelease && chown -R $USERNUM /project"

cp ./app/build/outputs/apk/release/app-release.apk $BASE_DIR/admintools/
