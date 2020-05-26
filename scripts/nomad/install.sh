#!/bin/bash
NOMAD_VERSION="0.11.0-beta1"
NOMAD_AUTOSCALER_VERSION="0.0.1-techpreview1"
CNI_PLUGINS_VERSION="0.8.5"
OS_KIND="linux"
OS_DISTRO="ubuntu"
OS_ARCH="amd64"
echo "==> Installing Nomad v${NOMAD_VERSION}..."
curl -sSL https://releases.hashicorp.com/nomad/${NOMAD_VERSION}/nomad_${NOMAD_VERSION}_${OS_KIND}_${OS_ARCH}.zip > /tmp/nomad.zip
sudo unzip /tmp/nomad.zip -d /tmp/
sudo install /tmp/nomad /usr/local/bin/nomad
sudo rm /tmp/nomad /tmp/nomad.zip
nomad -autocomplete-install
complete -C /usr/local/bin/nomad nomad
curl -sSL https://github.com/containernetworking/plugins/releases/download/v${CNI_PLUGINS_VERSION}/cni-plugins-${OS_KIND}-${OS_ARCH}-v${CNI_PLUGINS_VERSION}.tgz > /tmp/cni-plugins.tgz
sudo mkdir -p /opt/cni/bin
sudo tar -C /opt/cni/bin -xzf /tmp/cni-plugins.tgz
sudo rm /tmp/cni-plugins.tgz
cat > /etc/sysctl.d/20-bridge << EOF
net.bridge.bridge-nf-call-arptables = 1
net.bridge.bridge-nf-call-ip6tables = 1
net.bridge.bridge-nf-call-iptables = 1
EOF
sudo cp /cluster/services/nomad.service /etc/systemd/system/nomad.service
echo "==> Successfully installed Nomad"
