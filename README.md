# BTT Exchanger
BTT Exchanger is a platform for backup, checking, collating, and exporting oral bible translation

#Folders
- `install`
    - Contains install files, configs, scripts, docker-compose files, etc used to install Exchanger on a standalone server.
- `web`
    - Code and Dockerfile for the Web container image.
- `ap`
    - Dockerfile and config for the AP container
- `translationExchangeAndroid`
    - Contains Android platform specific files for the BTT-Exchanger android client

## Pre-reqs
1. Small Form Factor PC with SSD (1TB recommended)
1. TP-Link TL-WR802N Nano Wireles N Router (optional, but required to support more than 10-12 clients)
1. Debian 9.4 non-free installed with user named `ott`
    * The specific download we use is: https://cdimage.debian.org/cdimage/unofficial/non-free/images-including-firmware/archive/9.4.0-live+nonfree/amd64/iso-hybrid/debian-live-9.4.0-amd64-cinnamon+nonfree.iso
    * `ott` user needs sudoers priveledge. On install of Debian you can leave the root password blank and have the `ott` user automatically added to sudoers, or you can give the root user a password and add `ott` to sudoers yourself.
    * Wifi drivers need to be installed. This can be done in the install process if using Debian non-free.
- Amazon Idea list with recommended hardware: http://a.co/4Phho2K

## Installation

1. Download the `install.zip` file from releases in this repo
1. Extract the archive into `~/btt-exchanger` so that the files and directories such as `install.sh` script are located in `/home/ott/btt-exchanger`
1. Execute the install.sh script with something like `sudo ./install.sh`
1. You may need to run something like `sudo chmod +x install.sh` to enable execution on the script

## About the install.sh script
- The script adds the docker repo, installs dependencies, adds a cron job to start BTT-Exchanger, pulls the needed docker images, and eventually reboots the machine to start BTT-Exchanger via the cron job.

- There are two prompts to respond to in the install script. The first asks whether you want to install a Wifi Access Point on the server (PC) itself or if you want to use an external Access Point like the TP-Link mentioned above. The second prompt is to unlpug the network cable for reboot. The install sets up a DHCP server, so unplugging the network cable before rebooting and starting the DHCP server is highly recommended.  *When using the Access Point mode, the default password for the network is `oralmast`*

## TP-Link Config
1.  See the [TP-Link documentation](https://www.tp-link.com/us/support/download/tl-wr802n/) for how to change the config. Feel free to adjust its config such as admin password, SSID, and wireless password.
1. Plug the TP-Link in and connect to the default wifi network according to the instructions.
1. Follow the setup wizard and select "Smart IP" on the LAN Settings or Networking page. It will not allow you to uncheck the DHCP box, but DHCP will be disabled.

## Using BTT-Exchanger
1. After a reboot, either connect to the TP-Link Wireless Netowrk if using the TP-Link router or connect to the BTT_#### Wireless network if you are running the Wireless Access Point on the server. The setup script for using an external access point configures the DHCP and DNS servers in a way that requires the TP-Link nano router to be configured in Access Point mode.

1. Go to http://opentranslationtools.org to download the clients for BTT Exchanger and use the software.

## Use cases
- The primary use case for BTT Exchanger is as a standalone network and server combination. The included install script only supports this use case at this time. However, the use of Docker containers allows this server software to be deployable in just about any topology or infrastructure you would like, but will require some expertise in Docker and running containers.
- For instance, you could install docker and docker-compose yourself on a server, remove the AP container in one of the included docker-compose files, rename it to docker-compose.yaml, and run `docker-compose up` and you could have BTT Exchanger running on an existing server and network. You would need to configure the containers to boot on start up and point DNS for opentranslationtools.org at the server as well.

## Convenience Scripts
There are convenience scripts in the `run` folder.
- `enable_network.sh` - run this while in server AP mode to stop the BTT-Exchanger services and bring Network Manager back up so the user can connect the wifi card or ethernet to an internet connection.
- `clients_update.sh` - run this to pull the latest versions of the BTT-Exchanger clients from this repo's releases. Must have the server connected to the internet to do this. If running in server AP mode, you'll need to run the `enable_network.sh` script to enable the wifi card and connect to wifi before running this script.
- `switch_access_point_modes.sh` - run this to change the running config from running the AP on the server to running and external AP and vice-versa. This script will also fix a bad config, if something isn't coming up correctly, you can try this script to fix it.
