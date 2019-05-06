#!/bin/bash

./stop_server.sh
./enable_network.sh
cd ~/te-release
pwd
sudo docker-compose up -d $(< ./run/no_ap)
