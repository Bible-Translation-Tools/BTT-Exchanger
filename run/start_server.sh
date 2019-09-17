#!/bin/bash

./stop_server.sh
./disable_network.sh
cd ~/btt-exchanger
sudo docker-compose up -d
