# BTT-Exchanger
Installation files and scripts for Translation Exchange.

## Pre-reqs
1. Intel NUC with SSD (1TB recommended)
1. Debian 9.4 non-free installed with user named `ott`
    * The specific download we use is: https://cdimage.debian.org/cdimage/unofficial/non-free/images-including-firmware/archive/9.4.0-live+nonfree/amd64/iso-hybrid/debian-live-9.4.0-amd64-cinnamon+nonfree.iso
    * `ott` user needs sudoers priveledge. On install of Debian you can leave the root password blank and have the `ott` user automatically added to sudoers, or you can give the root user a password and add `ott` to sudoers yourself.
    * Wifi drivers need to be installed. This can be done in the install process if using Debian non-free.

## Installation

1. Download the zip file from releases in this repo
1. Extract the archive into `~/btt-exchanger` so that the files and directories such as `install.sh` script are located in `/home/ott/btt-exchanger`
1. Execute the install.sh script with something like `./install.sh`
1. You may need to run something like `chmod +x install.sh` to enable execution on the script

or

1. Clone this repo into ~/btt-exchanger with something like `git clone https://github.com/bible-translation-tools/btt-exchanger /home/ott/btt-exchanger`
1. Open a terminal in `/home/ott/btt-exchanger`
1. execute the install.sh script with something like `./install.sh`


## About the install.sh script
The script adds the docker repo, installs dependencies, adds a cron job to start tE, pulls the needed docker images, and eventually reboots the machine to start tE via the cron job
