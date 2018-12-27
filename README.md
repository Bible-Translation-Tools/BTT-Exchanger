# te-release
Installation files and scripts for Translation Exchange.

## Pre-reqs
1. Intel NUC with SSD
2. Ubuntu 18.04 installed with user named `Ott`

## Installation
1. Go to Releases in this repo
2. Download the archive you want to use
3. Extract the archive into `~te/base` so that the files and directories such as `install.sh` script is located in `/home/ott/te-base`
4. execute the install.sh script.

## About the install.sh script
The script adds the docker repo, installs dependencies, adds a cron job to start tE, pulls the needed docker images, and eventually reboots the machine to start tE via the cron job
