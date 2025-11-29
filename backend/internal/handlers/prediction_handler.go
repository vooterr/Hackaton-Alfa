package handlers

import (
	"hakaton-backend/internal/models"
	"net/http"

	"github.com/gin-gonic/gin"
)

func getPrediction() gin.HandlerFunc {
	return func(c *gin.Context) {
		var req models.Responce
		if err := c.BindJSON(&req); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{
				"error": "Invalid request",
			})
			return
		}
		response := models.Responce{
			PredictedIncome: 255000.0,
			Confidence:      0.85,
			Factors:         []string{"возраст", "кредитная история"},
			Recomendations: []models.Recomendation{
				{
					Product: "Кредитная карта",
					Reason:  "Доход позволяет",
				},
			},
		}

		c.JSON(http.StatusOK, response)
	}
}
