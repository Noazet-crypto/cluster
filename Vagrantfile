# -*- mode: ruby -*-
# vi: set ft=ruby :
Vagrant.configure(2) do |config|
  config.vm.box = "bento/ubuntu-18.04"
  config.vm.hostname = "Noazet Cluster"
  config.vm.synced_folder "./scripts/consul", "/cluster/scripts/consul"
  config.vm.synced_folder "./scripts/docker", "/cluster/scripts/docker"
  config.vm.synced_folder "./scripts/nomad", "/cluster/scripts/nomad"
  config.vm.synced_folder "./scripts/vault", "/cluster/scripts/vault"
  config.vm.provision "shell", run: "always" do |s|
    s.inline = "rm -f /cluster/.env && touch /cluster/.env"
  end
  config.vm.provision "shell", run: "always" do |s|
    s.inline = "echo CONSUL_HTTP_TOKEN=#{ENV['CONSUL_HTTP_TOKEN']} | tee -a /cluster/.env"
  end
  config.vm.provision "shell", run: "always" do |s|
    s.inline = "echo VAULT_TOKEN=#{ENV['VAULT_TOKEN']} | tee -a /cluster/.env"
  end
  config.vm.provision "shell", run: "always" do |s|
    s.inline = "echo NOMAD_TOKEN=#{ENV['NOMAD_TOKEN']} | tee -a /cluster/.env"
  end
  config.vm.define "node-server" do |node|
    node.vm.hostname = "node-server"
    node.vm.network "private_network", ip: "172.20.0.10"
    node.vm.synced_folder "./server/scripts", "/cluster/scripts"
    node.vm.synced_folder "./server/config", "/cluster/config"
    node.vm.synced_folder "./server/services", "/cluster/services"
    node.vm.provision "shell" do |s|
      s.inline = "bash /cluster/scripts/install.sh"
    end
    node.vm.provision "shell", run: "always" do |s|
      s.inline = "systemctl daemon-reload && systemctl start consul vault nomad"
    end
  end
  config.vm.define "node-client" do |node|
    node.vm.hostname = "node-client"
    node.vm.network "private_network", ip: "172.20.1.10"
    node.vm.synced_folder "./client/scripts", "/cluster/scripts"
    node.vm.synced_folder "./client/config", "/cluster/config"
    node.vm.synced_folder "./client/services", "/cluster/services"
    node.vm.provision "shell" do |s|
      s.inline = "bash /cluster/scripts/install.sh"
    end
    node.vm.provision "shell", run: "always" do |s|
      s.inline = "service docker restart"
    end
    node.vm.provision "shell", run: "always" do |s|
      s.inline = "systemctl daemon-reload && systemctl start consul vault nomad"
    end
  end
  config.vm.provider "virtualbox" do |vb|
    vb.memory = "2048"
  end
end
