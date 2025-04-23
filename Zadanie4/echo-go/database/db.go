package database

import (
	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
	"go-echo-gorm-app/models"
)

var DB *gorm.DB

func ConnectDB() {
	database, err := gorm.Open(sqlite.Open("app.db"), &gorm.Config{})
	if err != nil {
		panic("Failed to connect to database!")
	}

	database.AutoMigrate(
		&models.Product{},
		&models.Category{},
		&models.User{},
		&models.Order{},
		&models.Review{},
	)

	DB = database
}
