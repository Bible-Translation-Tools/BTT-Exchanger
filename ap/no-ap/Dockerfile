FROM debian:stretch-slim

RUN apt-get update --fix-missing && apt-get install -y \
    dbus \
    net-tools \
    iptables \
    dnsmasq \
    iw \
    nano \
 && apt-get clean && rm -rf /var/lib/apt/lists/*

COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

ENTRYPOINT ["/entrypoint.sh"]
