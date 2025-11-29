package database

import (
	"hakaton-backend/internal/models"

	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

func ConnectToDB(databaseURL string) (*gorm.DB, error) {
	db, err := gorm.Open(postgres.Open(databaseURL), &gorm.Config{})
	if err != nil {
		return nil, err
	}

	db.AutoMigrate(&models.Client{}, &models.Prediction{})
	return db, err
}
