package service

import (
	"github.com/Noazet-crypto/cluster/worker/containers/noazet-server/models"
	"github.com/Noazet-crypto/cluster/worker/containers/noazet-server/models/mysql"
)

func GetConfigs() ([]*models.Config, error) {
	return mysql.SharedStore().GetConfigs()
}
