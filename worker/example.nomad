
job "example" {
  datacenters = ["dc1"]
  type = "service"
  constraint {
    attribute = "${attr.kernel.name}"
    value     = "linux"
  }
  update {
    max_parallel = 1
    min_healthy_time = "10s"
    healthy_deadline = "3m"
    progress_deadline = "10m"
    auto_revert = false
    canary = 0
  }
  migrate {
    max_parallel = 1
    health_check = "checks"
    min_healthy_time = "10s"
    healthy_deadline = "5m"
  }
  group "cache" {
    count = 1
    restart {
      attempts = 2
      interval = "30m"
      delay = "15s"
      mode = "fail"
    }
    ephemeral_disk {
      size = 300
    }
    affinity {
      attribute = "${node.datacenter}"
      value  = "us-west1"
      weight = 100
    }
    spread {
      attribute = "${node.datacenter}"
      target "us-east1" {
        percent = 60
      }
      target "us-west1" {
        percent = 40
      }
    }
    task "redis" {
      driver = "docker"
      config {
        image = "redis:3.2"
        port_map {
          db = 6379
        }
      }
      artifact {
        source = "http://foo.com/artifact.tar.gz"
        options {
          checksum = "md5:c4aa853ad2215426eb7d70a21922e794"
        }
      }
      logs {
        max_files     = 10
        max_file_size = 15
      }
      resources {
        cpu    = 500
        memory = 256
        network {
          mbits = 10
          port  "db"  {}
        }
      }
      service {
        name = "redis-cache"
        tags = ["global", "cache"]
        port = "db"
        check {
          name     = "alive"
          type     = "tcp"
          interval = "10s"
          timeout  = "2s"
        }
      }
      template {
        data          = "---\nkey: {{ key \"service/my-key\" }}"
        destination   = "local/file.yml"
        change_mode   = "signal"
        change_signal = "SIGHUP"
      }
      template {
        data        = "KEY={{ key \"service/my-key\" }}"
        destination = "local/file.env"
        env         = true
      }
      vault {
        policies      = ["cdn", "frontend"]
        change_mode   = "signal"
        change_signal = "SIGHUP"
      }
      kill_timeout = "20s"
    }
  }
}
