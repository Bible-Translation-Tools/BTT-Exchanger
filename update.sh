#!//bin/bash

sudo docker-compose down

sudo systemctl enable NetworkManager.service
sudo systemctl start NetworkManager.service

read -n 1 -s -r -p "Please connect network to the Internet and press any key when connected"

sudo docker-compose pull web

echo -e "**********| Installation complete. Rebooting... |**********"

sudo reboot now
