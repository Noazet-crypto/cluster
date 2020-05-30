job "Database" {
  datacenters = ["dc1"]
  type = "service"
  group "MySQL" {
    restart {
      attempts = 10
      interval = "5m"
      delay = "15s"
      mode = "fail"
    }
    ephemeral_disk {
      migrate = true
      size    = 1000
      sticky  = true
    }
    # AWS Elastic Block Storage to sync DB
    task "mysql" {
      driver = "docker"
      config {
        image = "louisl98/mysql-exchange"
        port_map {
          mysql = 3306
        }
        command = "--log-bin=/var/lib/mysql/mysql-bin.log"
        args = [
          "--server-id=1"
        ]
        volumes = [
          "/docker-entrypoint-initdb.d/:/var/lib/mysql",
        ]
      }
      env {
        "MYSQL_ROOT_PASSWORD" = "root"
        "MYSQL_DATABASE" = "prod"
      }
      resources {
        network {
          port "mysql" {
            static = 3306
          }
        }
      }
      service {
        name = "mysql"
        tags = ["tcp", "db", "mysql"]
        port = "mysql"
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
