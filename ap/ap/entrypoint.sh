#!/bin/bash

pid=0
echo "PID INIT: $pid"

ETH=$(ifconfig | awk '/^en/{print $1}' | head -1 | cut -d':' -f1)
WLAN=$(iw dev | awk '$1=="Interface"{print $2}')

echo "Eth device: $ETH"
echo "Wlan device: $WLAN"

# SIGTERM-handler
term_handler() {
  if [ $pid -ne 0 ]; then
    echo "Get SIGTERM"
    
    /etc/init.d/dnsmasq stop
    /etc/init.d/hostapd stop
    /etc/init.d/dbus stop

    iptables -t nat -D POSTROUTING -o $ETH -j MASQUERADE
    iptables -D FORWARD -i $ETH -o $WLAN -m state --state RELATED,ESTABLISHED -j ACCEPT
    iptables -D FORWARD -i $WLAN -o $ETH -j ACCEPT

    kill -SIGTERM "$pid"
    wait "$pid"
  fi
  exit 143;
}

# config UUID
config_uuid() {
    UUID=$(cat /dev/urandom | tr -dc '0-9' | fold -w 4 | head -n 1)
    cp -f /etc/hostapd/hostapd.conf /tmp/hostapd.conf
    sed -i "s/ssid=.*/ssid=BTT_$UUID/g" /tmp/hostapd.conf
    cp -f /tmp/hostapd.conf /etc/hostapd/hostapd.conf
    echo "1" > /config_flag/config_done
}

cp -f /etc/dnsmasq.conf /tmp/dnsmasq.conf
cp -f /etc/hostapd/hostapd.conf /tmp/hostapd.conf
sed -i "s/interface=.*/interface=$WLAN/g" /tmp/dnsmasq.conf
sed -i "s/interface=.*/interface=$WLAN/g" /tmp/hostapd.conf
cp -f /tmp/dnsmasq.conf /etc/dnsmasq.conf
cp -f /tmp/hostapd.conf /etc/hostapd/hostapd.conf

if [ ! -f /config_flag/config_done ]; then
    config_uuid
fi

ifconfig $WLAN 10.0.0.1/24

sysctl -w net.ipv4.ip_forward=1
sysctl -p
iptables -t nat -A POSTROUTING -o $ETH -j MASQUERADE
iptables -A FORWARD -i $ETH -o $WLAN -m state --state RELATED,ESTABLISHED -j ACCEPT
iptables -A FORWARD -i $WLAN -o $ETH -j ACCEPT

/etc/init.d/dbus start
/etc/init.d/hostapd start
/etc/init.d/dnsmasq start

# setup handlers
trap 'kill ${!}; term_handler' SIGTERM

sleep infinity &

pid="$!"
echo "PID: $pid"

wait ${!}
