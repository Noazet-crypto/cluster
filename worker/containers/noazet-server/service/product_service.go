package service

import (
	"github.com/Noazet-crypto/cluster/worker/containers/noazet-server/models"
	"github.com/Noazet-crypto/cluster/worker/containers/noazet-server/models/mysql"
)

func GetProductById(id string) (*models.Product, error) {
	return mysql.SharedStore().GetProductById(id)
}

func GetProducts() ([]*models.Product, error) {
	return mysql.SharedStore().GetProducts()
}
