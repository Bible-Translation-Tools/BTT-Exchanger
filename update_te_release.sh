#!//bin/bash

./run/stop_server.sh
./run/enable_network.sh

git checkout .
git pull

echo -e "**********| Te-Release Updated |**********"
sleep 5

