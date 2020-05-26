job "Engine" {
  datacenters = ["dc1"]
  type = "service"
  group "App" {
    task "servers" {
      driver = "docker"
      config {
        image = "louisl98/go-trading-engine"
        port_map {
          Worker = 8000
        }
        port_map {
          API = 8001
        }
        port_map {
          WebSocket = 8002
        }
      }
      resources {
        network {
          port "Worker" {
            static = 8000
          }
          port "API" {
            static = 8001
          }
          port "WebSocket" {
            static = 8002
          }
        }
      }
      service {
        name = "noazet-server"
        tags = ["http", "app", "go"]
        port = "Worker"
        check {
          name     = "alive"
          type     = "http"
          path     = "/worker"
          interval = "10s"
          timeout  = "2s"
        }
      }
      service {
        name = "api"
        tags = ["http", "rest", "app", "go"]
        port = "API"
        check {
          name     = "alive"
          type     = "http"
          path     = "/api/products"
          interval = "10s"
          timeout  = "2s"
        }
      }
      service {
        name = "websocket"
        tags = ["tcp", "ws", "app", "go"]
        port = "WebSocket"
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
