job "Cache" {
  datacenters = ["dc1"]
  type = "service"
  group "Redis" {
    restart {
      attempts = 10
      interval = "5m"
      delay = "15s"
      mode = "fail"
    }
    task "redis" {
      driver = "docker"
      config {
        image = "louisl98/redis-exchange"
        sysctl {
          net.core.somaxconn = "511"
        }
        port_map {
          redis = 6379
        }
        command = "redis-server"
        args = [
          "--requirepass",
          "root"
        ]
        // volumes = [
        //   "./store:/data"
        // ]
      }
      resources {
        network {
          port "redis" {
            static = 6379
          }
        }
      }
      service {
        name = "redis"
        tags = ["tcp", "db", "redis"]
        port = "redis"
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
