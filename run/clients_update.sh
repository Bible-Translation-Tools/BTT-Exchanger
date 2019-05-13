#!/bin/bash

cd /home/$USER/te-release

echo -e "${COLOR}----------| Downloading clients |----------${NC}"

URL=$(curl 'https://api.github.com/repos/wycliffeassociates/te-release/releases?per_page=1' | jq -r '.[0] | .assets[].browser_download_url')
curl -L $URL --output clients.zip
rm -r clients/
unzip clients.zip

echo -e "${COLOR}----------| Downloading TranslationRecorder|----------${NC}"
URL=$(curl 'https://api.github.com/repos/wycliffeassociates/translationrecorder/releases?per_page=1' | jq -r '.[0] | .assets[].browser_download_url')
curl -L $URL --output clients/translationRecorder.apk

echo -e "${COLOR}----------| Downloading AdminTools into admintools dir |----------${NC}"
rm -r admintools/
mkdir admintools
cd admintools
curl 'https://api.github.com/repos/wycliffeassociates/teadmin/releases?per_page=1' | jq -r '.[0] | .assets[].browser_download_url' > files.txt
sed -i "s/.*.snap//g" files.txt
wget -i files.txt
URL=$(curl 'https://api.github.com/repos/wycliffeassociates/tr-chunk-browser/releases?per_page=1' | jq -r '.[0] | .assets[].browser_download_url')
curl -L $URL -O
URL=$(curl 'https://api.github.com/repos/wycliffeassociates/trconverterandroid/releases?per_page=1' | jq -r '.[0] | .assets[].browser_download_url')
curl -L $URL -O
URL=$(curl 'https://api.github.com/repos/wycliffeassociates/teadminandroid/releases?per_page=1' | jq -r '.[0] | .assets[].browser_download_url')
curl -L $URL -O

echo -e "${COLOR}**********| DONE! |**********${NC}"

sleep 3
