#!/bin/bash

pid=0
echo "PID INIT: $pid"

ETH=$(ifconfig | awk '/^en/{print $1}' | head -1 | cut -d':' -f1)

echo "Eth device: $ETH"

# SIGTERM-handler
term_handler() {
  if [ $pid -ne 0 ]; then
    echo "Get SIGTERM"
    
    /etc/init.d/dnsmasq stop
    /etc/init.d/dbus stop

    kill -SIGTERM "$pid"
    wait "$pid"
  fi
  exit 143;
}

cp -f /etc/dnsmasq.conf /tmp/dnsmasq.conf
sed -i "s/interface=.*/interface=$ETH/g" /tmp/dnsmasq.conf
cp -f /tmp/dnsmasq.conf /etc/dnsmasq.conf
 
ifconfig $ETH 10.0.0.1/24

sysctl -w net.ipv4.ip_forward=1
sysctl -p

/etc/init.d/dbus start
/etc/init.d/dnsmasq start

# setup handlers
trap 'kill ${!}; term_handler' SIGTERM

sleep infinity &

pid="$!"
echo "PID: $pid"

wait ${!}
