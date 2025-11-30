package handlers

import (
	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

func SetupRoute(db *gorm.DB) *gin.Engine {
	router := gin.Default()

	router.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"http://localhost:3000", "http://127.0.0.1:3000"},
		AllowMethods:     []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Authorization"},
		ExposeHeaders:    []string{"Content-Length"},
		AllowCredentials: true,
	}))

	api := router.Group("/api")
	{
		api.GET("/health", healthCheck)
		api.GET("/clients", getClients(db))
		api.GET("/clients/search", searchClients(db))
		api.GET("/clients/:id", getClientByID(db))
		api.POST("/clients", addClient(db))
		api.POST("/predict/income", getPrediction())
		api.GET("/analytics", getAnalytics(db))
	}
	return router
}
