package service

import (
	"github.com/Noazet-crypto/trading-engine/models"
	"github.com/Noazet-crypto/trading-engine/models/mysql"
)

func GetConfigs() ([]*models.Config, error) {
	return mysql.SharedStore().GetConfigs()
}
