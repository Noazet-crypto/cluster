package main

import (
	"net/http"
	_ "net/http/pprof"

	"github.com/Noazet-crypto/cluster/worker/containers/noazet-server/conf"
	"github.com/Noazet-crypto/cluster/worker/containers/noazet-server/matching"
	"github.com/Noazet-crypto/cluster/worker/containers/noazet-server/models"
	"github.com/Noazet-crypto/cluster/worker/containers/noazet-server/pushing"
	"github.com/Noazet-crypto/cluster/worker/containers/noazet-server/rest"
	"github.com/Noazet-crypto/cluster/worker/containers/noazet-server/service"
	"github.com/Noazet-crypto/cluster/worker/containers/noazet-server/worker"
	"github.com/gin-gonic/gin"
	"github.com/prometheus/common/log"
)

func main() {
	gbeConfig := conf.GetConfig()
	go func() {
		r := gin.Default()
		r.GET("/worker", func(c *gin.Context) {
			c.JSON(200, gin.H{
				"message": "Health OK",
			})
		})
		log.Info(http.ListenAndServe(":8000", r))
	}()
	go models.NewBinLogStream().Start()
	matching.StartEngine()
	pushing.StartServer()
	worker.NewFillExecutor().Start()
	worker.NewBillExecutor().Start()
	products, err := service.GetProducts()
	if err != nil {
		panic(err)
	}
	for _, product := range products {
		worker.NewTickMaker(product.Id, matching.NewKafkaLogReader("tickMaker", product.Id, gbeConfig.Kafka.Brokers)).Start()
		worker.NewFillMaker(matching.NewKafkaLogReader("fillMaker", product.Id, gbeConfig.Kafka.Brokers)).Start()
		worker.NewTradeMaker(matching.NewKafkaLogReader("tradeMaker", product.Id, gbeConfig.Kafka.Brokers)).Start()
	}
	rest.StartServer()
	select {}
}
