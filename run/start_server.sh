#!/bin/bash

./stop_server.sh
./disable_network.sh
cd ~/te-release
sudo docker-compose up -d
