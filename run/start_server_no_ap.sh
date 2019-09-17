#!/bin/bash

./stop_server.sh
./enable_network.sh
cd ~/btt-exchanger
pwd
sudo docker-compose up -d $(< ./run/no_ap)
