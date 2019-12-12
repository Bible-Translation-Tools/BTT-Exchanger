#!/bin/bash

HEIGHT=10
WIDTH=70

if [ -f /etc/cron.d/cron_dockerup_external_ap ] && [ -f /etc/cron.d/cron_dockerup_server_ap ]; then
    whiptail --msgbox "The current AP configuration is broken. Please run the 'switch_access_point_modes.sh' script to fix the config." $HEIGHT $WIDTH && sleep 1 && exit
#If neither file is present, add the external AP file
elif [ ! -f /etc/cron.d/cron_dockerup_external_ap ] && [ ! -f /etc/cron.d/cron_dockerup_server_ap ]; then
    whiptail --msgbox "The current AP configuration is broken. Please run the 'switch_access_point_modes.sh' script to fix the config." $HEIGHT $WIDTH && sleep 1 && exit
#If only the server AP file is present, remove it and place the external AP file (this is the expected behavior)
elif [ ! -f /etc/cron.d/cron_dockerup_external_ap ] && [ -f /etc/cron.d/cron_dockerup_server_ap ]; then
    sudo docker-compose -f /home/ott/btt-exchanger/docker-compose-server-ap.yaml down && sudo systemctl start NetworkManager && whiptail --msgbox "Network is enabled. Connect to Wifi to access the internet. Reboot the server when finished to restart BTT-Exchanger." $HEIGHT $WIDTH && sleep 1 && exit
#If only the external AP file is present, tell the user it's already in the selected AP operating mode
elif [ -f /etc/cron.d/cron_dockerup_external_ap ] && [ ! -f /etc/cron.d/cron_dockerup_server_ap ]; then
    clear && whiptail --msgbox "The server is currently configured to run an external AP. Please use Wifi to access the internet if needed." $HEIGHT $WIDTH && sleep 1 && exit
fi

