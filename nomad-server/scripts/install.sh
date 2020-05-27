#!/bin/bash
echo "==> Updating `apt` package index..."
sudo apt-get update
echo "==> Installing `apt` packages..."
sudo apt-get install -y \
  curl \
  unzip \
  vim \
  apt-transport-https \
  ca-certificates \
  gnupg-agent \
  software-properties-common
bash /cluster/scripts/consul/install.sh
bash /cluster/scripts/nomad/install.sh
bash /cluster/scripts/vault/install.sh
sudo systemctl daemon-reload
echo "==> Installation successfully completed!"
