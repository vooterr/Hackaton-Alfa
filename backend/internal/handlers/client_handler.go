package handlers

import (
	"hakaton-backend/internal/models"
	"net/http"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

func getClientByID(db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		id := c.Param("id")

		var client models.Client
		db.First(&client, id)

		c.JSON(http.StatusOK, client)
	}
}

func getClients(db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		var clients []models.Client
		result := db.Find(&clients)
		if result.Error != nil {
			c.JSON(http.StatusInternalServerError, gin.H{
				"error": "error with database",
			})
			return
		}
		c.JSON(http.StatusOK, clients)
	}
}

func addClient(db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		var client models.Client
		if err := c.BindJSON(&client); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{
				"error": "input problem",
			})
		}

		result := db.Create(&client)
		if result.Error != nil {
			c.JSON(http.StatusInternalServerError, gin.H{
				"error": "client creation failed",
			})
			return
		}
		c.JSON(http.StatusCreated, client)
	}
}
