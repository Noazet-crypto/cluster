#!/bin/bash
DOCKER_VERSION="stable"
OS_KIND="linux"
OS_DISTRO="ubuntu"
OS_ARCH="amd64"
echo "==> Removing old Docker-related packages...."
sudo apt-get remove \
  docker \
  docker-engine \
  docker.io \
  containerd \
  runc
curl -fsSL https://download.docker.com/${OS_KIND}/${OS_DISTRO}/gpg | sudo apt-key add -
sudo apt-key fingerprint 0EBFCD88
sudo add-apt-repository \
  "deb [arch=${OS_ARCH}] https://download.docker.com/${OS_KIND}/${OS_DISTRO} \
  $(lsb_release -cs) \
  ${DOCKER_VERSION}"
echo "==> Installing ${DOCKER_VERSION} version of Docker...."
sudo apt-get install -y \
  docker-ce \
  docker-ce-cli \
  containerd.io
sudo service docker stop
sudo usermod -aG docker $USER
echo "==> Successfully installed Docker"
