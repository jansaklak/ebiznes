package main

import (
	"github.com/labstack/echo/v4"
	"go-echo-gorm-app/controllers"
	"go-echo-gorm-app/database"
)

func main() {
	e := echo.New()

	database.ConnectDB()

	// Routes
	e.POST("/products", controllers.CreateProduct)
	e.GET("/products", controllers.GetProducts)
	e.GET("/products/:id", controllers.GetProduct)
	e.PUT("/products/:id", controllers.UpdateProduct)
	e.DELETE("/products/:id", controllers.DeleteProduct)

	e.Logger.Fatal(e.Start(":8080"))
}
