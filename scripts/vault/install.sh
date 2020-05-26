#!/bin/bash
VAULT_VERSION="1.3.4"
OS_KIND="linux"
OS_DISTRO="ubuntu"
OS_ARCH="amd64"
echo "==> Installing Vault v${VAULT_VERSION}..."
curl -sSL https://releases.hashicorp.com/vault/${VAULT_VERSION}/vault_${VAULT_VERSION}_${OS_KIND}_${OS_ARCH}.zip > /tmp/vault.zip
sudo unzip /tmp/vault.zip -d /tmp/
sudo install /tmp/vault /usr/local/bin/vault
sudo rm /tmp/vault /tmp/vault.zip
vault -autocomplete-install
complete -C /usr/local/bin/vault vault
sudo cp /cluster/services/vault.service /etc/systemd/system/vault.service
echo "==> Successfully installed Vault"
