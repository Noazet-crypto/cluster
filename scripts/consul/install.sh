#!/bin/bash
CONSUL_VERSION="1.7.2"
OS_KIND="linux"
OS_DISTRO="ubuntu"
OS_ARCH="amd64"
echo "==> Installing Consul v${CONSUL_VERSION}..."
curl -sSL https://releases.hashicorp.com/consul/${CONSUL_VERSION}/consul_${CONSUL_VERSION}_${OS_KIND}_${OS_ARCH}.zip > /tmp/consul.zip
sudo unzip /tmp/consul.zip -d /tmp/
sudo install /tmp/consul /usr/local/bin/consul
sudo rm /tmp/consul /tmp/consul.zip
consul -autocomplete-install
complete -C /usr/local/bin/consul consul
sudo cp /cluster/services/consul.service /etc/systemd/system/consul.service
echo "==> Successfully installed Consul"
