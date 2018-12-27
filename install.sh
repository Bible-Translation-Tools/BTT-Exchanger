#!/bin/bash

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

sudo apt update && sudo apt install -y curl python-pip apt-transport-https ca-certificates software-properties-common
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo apt-key add -
sudo add-apt-repository "deb [arch=amd64] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable"
sudo apt update && sudo apt install -y docker-ce
sudo pip install docker-compose

echo -e "${COLOR}----------| Inserting crontab task... |----------${NC}"

sudo cp /home/$USER/te-base/cron_netsvc_and_dockerup /etc/cron.d/cron_netsvc_and_dockerup

cd /home/$USER/te-base

sudo -- sh -c -e "echo '10.0.0.1	opentranslationtools.org' >> /etc/hosts"

echo -e "${COLOR}----------| Pulling Docker Images... |----------${NC}"
sudo docker-compose pull

echo -e "${COLOR}**********| Installation complete. Rebooting... |**********${NC}"
sleep 3
sudo systemctl reboot
