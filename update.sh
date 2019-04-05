#!//bin/bash

sudo docker-compose down

sudo systemctl enable NetworkManager.service
sudo systemctl start NetworkManager.service

clear

echo -e "\033[1;35mPlease connect network to the Internet and press any key when connected\033[0m"

read -n 1 -s -r 

sudo docker-compose pull web

clear

echo -e "**********| Installation complete. Rebooting... |**********"
sleep 5
sudo reboot now
