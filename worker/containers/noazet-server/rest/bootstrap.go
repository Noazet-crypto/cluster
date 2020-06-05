package rest

import (
	"github.com/Noazet-crypto/trading-engine/conf"
	"github.com/siddontang/go-log/log"
)

func StartServer() {
	gbeConfig := conf.GetConfig()
	httpServer := NewHttpServer(gbeConfig.RestServer.Addr)
	go httpServer.Start()
	log.Info("rest server ok")
}
