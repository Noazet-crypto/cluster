package service

import (
	"github.com/Noazet-crypto/cluster/worker/containers/noazet-server/models"
	"github.com/Noazet-crypto/cluster/worker/containers/noazet-server/models/mysql"
)

func GetLastTickByProductId(productId string, granularity int64) (*models.Tick, error) {
	return mysql.SharedStore().GetLastTickByProductId(productId, granularity)
}

func GetTicksByProductId(productId string, granularity int64, limit int) ([]*models.Tick, error) {
	return mysql.SharedStore().GetTicksByProductId(productId, granularity, limit)
}

func AddTicks(ticks []*models.Tick) error {
	if len(ticks) == 0 {
		return nil
	}
	return mysql.SharedStore().AddTicks(ticks)
}
