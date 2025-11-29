package handlers

import (
	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

func SetupRoute(db *gorm.DB) *gin.Engine {
	router := gin.Default()

	api := router.Group("/api")
	{
		api.GET("/health", healthCheck)
		api.GET("/clients", getClients(db))
		api.GET("/clients:id", getClientByID(db))
		api.POST("/clients", addClient(db))
		api.POST("/predict/income", getPrediction())
	}
	return router
}
