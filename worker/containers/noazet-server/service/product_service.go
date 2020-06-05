package service

import (
	"github.com/Noazet-crypto/trading-engine/models"
	"github.com/Noazet-crypto/trading-engine/models/mysql"
)

func GetProductById(id string) (*models.Product, error) {
	return mysql.SharedStore().GetProductById(id)
}

func GetProducts() ([]*models.Product, error) {
	return mysql.SharedStore().GetProducts()
}
