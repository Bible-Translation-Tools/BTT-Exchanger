#!/bin/bash

./stop_server.sh
./enable_network.sh
cd ~/te-release
sudo docker-compose up -d $(< no_ap)
