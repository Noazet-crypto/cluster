job "Platform" {
  datacenters = ["dc1"]
  type = "service"
  group "App" {
    task "frontend" {
      driver = "docker"
      config {
        image = "louisl98/ts-trading-platform"
        port_map {
          Frontend = 3000
        }
      }
      resources {
        network {
          port "Frontend" {
            static = 3000
          }
        }
      }
      service {
        name = "noazet-client"
        tags = ["http", "ts", "app", "vue", "gulp"]
        port = "Frontend"
        check {
          name     = "alive"
          type     = "http"
          path     = "/"
          interval = "10s"
          timeout  = "2s"
        }
      }
    }
  }
}
