package matching

import (
	"github.com/Noazet-crypto/trading-engine/conf"
	"github.com/Noazet-crypto/trading-engine/service"
	"github.com/siddontang/go-log/log"
)

func StartEngine() {
	gbeConfig := conf.GetConfig()
	products, err := service.GetProducts()
	if err != nil {
		panic(err)
	}
	for _, product := range products {
		orderReader := NewKafkaOrderReader(product.Id, gbeConfig.Kafka.Brokers)
		snapshotStore := NewRedisSnapshotStore(product.Id)
		logStore := NewKafkaLogStore(product.Id, gbeConfig.Kafka.Brokers)
		matchEngine := NewEngine(product, orderReader, logStore, snapshotStore)
		matchEngine.Start()
	}
	log.Info("match engine ok")
}
