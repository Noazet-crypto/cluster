job "Broker" {
  datacenters = ["dc1"]
  type = "service"
  group "Kafka" {
    restart {
      attempts = 10
      interval = "5m"
      delay = "15s"
      mode = "fail"
    }
    task "kafka" {
      driver = "docker"
      config {
        image = "wurstmeister/kafka"
        port_map {
          kafka = 9092
        }
        // command = "scale"
        // args = [
        //   "kafka=3"
        // ]
        // volumes = [
        //   "/var/run/docker.sock:/var/run/docker.sock"
        // ]
      }
      env {
        "KAFKA_ADVERTISED_HOST_NAME" = "172.20.1.10"
        "KAFKA_ZOOKEEPER_CONNECT" = "172.20.1.10:2181"
      }
      resources {
        network {
          port "kafka" {
            static = 9092
          }
        }
      }
      service {
        name = "kafka"
        tags = ["tcp", "broker", "kafka"]
        port = "kafka"
        check {
          name     = "alive"
          type     = "tcp"
          interval = "10s"
          timeout  = "2s"
        }
      }
    }
  }
  group "Zookeeper" {
    task "zookeeper" {
      driver = "docker"
      config {
        image = "wurstmeister/zookeeper"
        port_map {
          zookeeper = 2181
        }
      }
      resources {
        network {
          port "zookeeper" {
            static = 2181
          }
        }
      }
      service {
        name = "zookeeper"
        tags = ["tcp", "zookeeper", "zk"]
        port = "zookeeper"
        check {
          name     = "alive"
          type     = "tcp"
          interval = "10s"
          timeout  = "2s"
        }
      }
    }
  }
}
