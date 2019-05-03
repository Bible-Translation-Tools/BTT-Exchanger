#!/bin/bash

# Requires Jenkins Go Plugin to be enabled in build environment

#exit on error
set -e
set -x

export GOPATH=$(pwd)
export GITHUB_USER=WycliffeAssociates
export GITHUB_TOKEN=$1
export GITHUB_REPO=te-release
export PATH=$PATH:$GOPATH/bin

#Get the latest tag
TAG=$(git describe --tags --abbrev=0)

#Make sure we actually grabbed a tag
if [ -z $TAG ]; then exit
fi

#Check if there is a release for the latest tag
#Exit if a release already exists
DOES_RELEASE_EXIST=$(curl -s https://api.github.com/repos/wycliffeassociates/te-release/releases/tags/$TAG | grep '"message": "Not Found"')
if [ -z "$DOES_RELEASE_EXIST" ]; then exit;
fi

mkdir clients
cp translationExchangeAndroid/app/build/outputs/apk/release/app-release.apk clients/te_android_client.apk
cp translationExchange/dist/*.exe clients/te_windows_client.exe
cp translationExchange/dist/*.AppImage clients/te_mac_client.AppImage
cp translationExchange/dist/*.snap clients/te_linux_client.snap
zip clients.zip ./clients/*

#Check for the gothub Github release go package, if not there, go get it
if [ ! -f "$GOPATH/bin/gothub" ]; then
go get github.com/itchio/gothub; else exit;
fi

#create the release
gothub release --tag $TAG -p

#Upload asset
gothub upload --tag $TAG --name "clients.zip" --file ./clients.zip
