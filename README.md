# te-release
Installation files and scripts for Translation Exchange.

## Pre-reqs
1. Intel NUC with SSD (1TB recommended)
1. Debian 9.4 non-free installed with user named `ott`
  * The specific download we use is: https://cdimage.debian.org/cdimage/unofficial/non-free/images-including-firmware/archive/9.4.0-live+nonfree/amd64/iso-hybrid/debian-live-9.4.0-amd64-cinnamon+nonfree.iso

## Installation

1. Download the zip file from releases in this repo
1. Extract the archive into `~/te-release` so that the files and directories such as `install.sh` script are located in `/home/ott/te-release`
1. Execute the install.sh script with something like `./install.sh`
1. You may need to run something like `chmod +x install.sh` to enable execution on the script

or

1. Clone this repo into ~/te-release with something like `git clone https://github.com/wycliffeassociates/te-release /home/ott/te-release`
1. execute the install.sh script with something like `./install.sh`


## About the install.sh script
The script adds the docker repo, installs dependencies, adds a cron job to start tE, pulls the needed docker images, and eventually reboots the machine to start tE via the cron job
