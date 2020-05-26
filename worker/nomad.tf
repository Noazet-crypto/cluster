provider "nomad" {
    address = "http://172.20.0.10:4646"
    region = "global"
}

resource "nomad_job" "database" {
    jobspec = file("${path.module}/database.nomad")
}

resource "nomad_job" "cache" {
    jobspec = file("${path.module}/cache.nomad")
}

resource "nomad_job" "broker" {
    jobspec = file("${path.module}/broker.nomad")
}

resource "nomad_job" "engine" {
    jobspec = file("${path.module}/engine.nomad")
}

resource "nomad_job" "platform" {
    jobspec = file("${path.module}/platform.nomad")
}
