#!/bin/bash

#run this next line if you need to make this file executable
# sudo chmod +x /home/ott/install.sh

set -e

COLOR='\033[0;35m'
NC='\033[0m'

USER=$1

if [ -z "$1" ]
  then
    USER="ott"
fi

if [[ $(grep -c "^$USER:" /etc/passwd) = 0 ]]; then
	echo "Error: User '$USER' doesn't exist" 1>&2
	exit 1
fi

echo -e "${COLOR}----------| Installing neccessary software for the server... |----------${NC}"

sudo apt update && sudo apt install -y curl python-pip apt-transport-https ca-certificates software-properties-common jq
curl -fsSL https://download.docker.com/linux/debian/gpg | sudo apt-key add -
sudo add-apt-repository "deb [arch=amd64] https://download.docker.com/linux/debian $(lsb_release -cs) stable"
sudo apt update && sudo apt install -y docker-ce
sudo pip install docker-compose

echo -e "${COLOR}----------| Inserting crontab task... |----------${NC}"

sudo chmod -R +x /home/$USER/btt-exchanger/scripts
sudo cp /home/$USER/btt-exchanger/cron_netsvc_and_dockerup /etc/cron.d/cron_netsvc_and_dockerup

cd /home/$USER/btt-exchanger

echo -e "${COLOR}----------| Downloading clients |----------${NC}"

URL=$(curl 'https://api.github.com/repos/bible-translation-tools/btt-exchanger/releases?per_page=1' | jq -r '.[0] | .assets[].browser_download_url')
curl -L $URL --output clients.zip
rm -rf clients/
unzip clients.zip

echo -e "${COLOR}----------| Downloading TranslationRecorder|----------${NC}"
URL=$(curl 'https://api.github.com/repos/wycliffeassociates/translationrecorder/releases?per_page=1' | jq -r '.[0] | .assets[].browser_download_url')
curl -L $URL --output clients/translationRecorder.apk

echo -e "${COLOR}----------| Downloading AdminTools into admintools dir |----------${NC}"
rm -rf admintools/
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
cd /home/$USER/btt-exchanger

sudo -- sh -c -e "echo '10.0.0.1	opentranslationtools.org' >> /etc/hosts"

echo -e "${COLOR}----------| Pulling Docker Images... |----------${NC}"
sudo docker-compose pull

echo -e "${COLOR}**********| Installation complete. Rebooting... |**********${NC}"
sleep 3
sudo systemctl reboot
