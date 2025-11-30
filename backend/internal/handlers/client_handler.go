package handlers

import (
	"fmt"
	"hakaton-backend/internal/models"
	"math"
	"net/http"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

type ClientResponse struct {
	ID      string  `json:"id"`
	Name    string  `json:"name"`
	Income  float64 `json:"income"`
	Segment string  `json:"segment"`
	Score   float64 `json:"score"`
	Region  string  `json:"region"`
}

func calculateSegment(income float64) string {
	switch {
	case income >= 150000:
		return "VIP"
	case income >= 100000:
		return "Премиум"
	case income >= 50000:
		return "Стандарт"
	default:
		return "Базовый"
	}
}

func calculateScore(client models.Client) float64 {
	baseScore := client.Income / 20000.0
	ageBonus := float64(client.Age) / 10.0
	score := baseScore + ageBonus

	if score > 10.0 {
		return 10.0
	}
	return math.Round(score*10) / 10
}

func getClientByID(db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		id := c.Param("id")

		var client models.Client
		if err := db.First(&client, id).Error; err != nil {
			c.JSON(http.StatusNotFound, gin.H{
				"error": "Client not found",
			})
			return
		}

		response := ClientResponse{
			ID:      fmt.Sprintf("%d", client.ID), // Исправил преобразование ID
			Name:    client.FirstName + " " + client.LastName,
			Income:  client.Income,
			Segment: calculateSegment(client.Income),
			Score:   calculateScore(client), // Передаем всю структуру client
			Region:  "Москва",
		}

		c.JSON(http.StatusOK, response)
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

		var response []ClientResponse // Используем структуру вместо map
		for _, client := range clients {
			clientData := ClientResponse{
				ID:      fmt.Sprintf("%d", client.ID),
				Name:    client.FirstName + " " + client.LastName,
				Income:  client.Income,
				Segment: calculateSegment(client.Income),
				Score:   calculateScore(client), // Передаем client, а не client.Income
				Region:  "Москва",
			}
			response = append(response, clientData)
		}

		c.JSON(http.StatusOK, response)
	}
}

func addClient(db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		var client models.Client
		if err := c.BindJSON(&client); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{
				"error": "input problem: " + err.Error(),
			})
			return
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

func searchClients(db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		query := c.Query("q")
		fmt.Printf("Search query: %s\n", query)
		segment := c.Query("segment")
		region := c.Query("region")

		var clients []models.Client
		dbQuery := db.Model(&models.Client{})

		if query != "" {
			dbQuery = dbQuery.Where("first_name ILIKE ? OR last_name ILIKE ?", // Исправил second_name на last_name
				"%"+query+"%", "%"+query+"%")
		}

		if region != "" && region != "all" {
			dbQuery = dbQuery.Where("region = ?", region)
		}

		dbQuery.Find(&clients)

		var filteredClients []models.Client
		for _, client := range clients {
			clientSegment := calculateSegment(client.Income)
			if segment == "" || segment == "all" || clientSegment == segment {
				filteredClients = append(filteredClients, client)
			}
		}

		var response []ClientResponse
		for _, client := range filteredClients {
			response = append(response, ClientResponse{
				ID:      fmt.Sprintf("%d", client.ID),
				Name:    client.FirstName + " " + client.LastName,
				Income:  client.Income,
				Segment: calculateSegment(client.Income),
				Score:   calculateScore(client), // Исправил - передаем client
				Region:  getRegionFromDB(client),
			})
		}
		fmt.Printf("Found %d clients\n", len(response))
		c.JSON(http.StatusOK, response)
	}
}

func getRegionFromDB(client models.Client) string {
	return "Москва"

}
