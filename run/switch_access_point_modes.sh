#!/bin/bash

set -e

sudo echo "."

HEIGHT=10
WIDTH=70
CHOICE_HEIGHT=3
TITLE="Access Point"
MENU="Choose one of the following options:"

OPTIONS=("1" "Run a Wifi Access Point on the server hardware"
         "2" "Run an external Wifi Access Point (e.g. TP-Link TL-WR802N)")

CHOICE=$(whiptail --title "$TITLE" \
                --menu "$MENU" \
                $HEIGHT $WIDTH $CHOICE_HEIGHT \
                "${OPTIONS[@]}" \
                3>&1 1>&2 2>&3)

clear

case $CHOICE in
        #Server AP
        1)
            #If both files are present, remove external so we only run the server AP
            if [ -f /etc/cron.d/cron_dockerup_server_ap ] && [ -f /etc/cron.d/cron_dockerup_external_ap ]; then
                sudo rm /etc/cron.d/cron_dockerup_external_ap
            #If neither file is present, add the server AP file
            elif [ ! -f /etc/cron.d/cron_dockerup_server_ap ] && [ ! -f /etc/cron.d/cron_dockerup_external_ap ]; then
                sudo cp /home/ott/btt-exchanger/cron_dockerup_server_ap /etc/cron.d/cron_dockerup_server_ap
            #If only the external file is present, remove it and place the server AP file (this is the expected behavior)
            elif [ ! -f /etc/cron.d/cron_dockerup_server_ap ] && [ -f /etc/cron.d/cron_dockerup_external_ap ]; then
                sudo rm /etc/cron.d/cron_dockerup_external_ap && sudo cp /home/ott/btt-exchanger/cron_dockerup_server_ap /etc/cron.d/cron_dockerup_server_ap
            #If only the Server AP file is present, tell the user it's already in the selected AP operating mode
            elif [ -f /etc/cron.d/cron_dockerup_server_ap ] && [ ! -f /etc/cron.d/cron_dockerup_external_ap ]; then
                clear && whiptail --msgbox "The server is already configured to run an AP on the server hardware. Press Enter to exit this script" $HEIGHT $WIDTH && sleep 1 && exit
            fi
            ;;
        #External AP
        2)
            #If both files are present, remove server so we only run the external AP
            if [ -f /etc/cron.d/cron_dockerup_external_ap ] && [ -f /etc/cron.d/cron_dockerup_server_ap ]; then
                sudo rm /etc/cron.d/cron_dockerup_server_ap
            #If neither file is present, add the external AP file
            elif [ ! -f /etc/cron.d/cron_dockerup_external_ap ] && [ ! -f /etc/cron.d/cron_dockerup_server_ap ]; then
                sudo cp /home/ott/btt-exchanger/cron_dockerup_external_ap /etc/cron.d/cron_dockerup_external_ap
            #If only the server AP file is present, remove it and place the external AP file (this is the expected behavior)
            elif [ ! -f /etc/cron.d/cron_dockerup_external_ap ] && [ -f /etc/cron.d/cron_dockerup_server_ap ]; then
                sudo rm /etc/cron.d/cron_dockerup_server_ap && sudo cp /home/ott/btt-exchanger/cron_dockerup_external_ap /etc/cron.d/cron_dockerup_external_ap
            #If only the external AP file is present, tell the user it's already in the selected AP operating mode
            elif [ -f /etc/cron.d/cron_dockerup_external_ap ] && [ ! -f /etc/cron.d/cron_dockerup_server_ap ]; then
                clear && whiptail --msgbox "The server is already configured to run an external AP. Press Enter to exit this script" $HEIGHT $WIDTH && sleep 1 && exit
            fi
            sudo systemctl enable NetworkManager.service
            clear
            whiptail --msgbox "Please plug in the External Access Point then press Enter to continue" $HEIGHT $WIDTH
            ;;
esac

#make sure all the containers are removed
sudo docker-compose -f /home/ott/btt-exchanger/docker-compose-ext-ap.yaml down
sudo docker-compose -f /home/ott/btt-exchanger/docker-compose-server-ap.yaml down

clear
echo "AP mode configured, rebooting now"
sleep 2
sudo systemctl reboot
