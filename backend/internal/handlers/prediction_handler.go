package handlers

import (
	"hakaton-backend/internal/models"
	"net/http"

	"github.com/gin-gonic/gin"
)

func getPrediction() gin.HandlerFunc {
	return func(c *gin.Context) {
		var req models.Request
		if err := c.BindJSON(&req); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{
				"error": "Invalid request: " + err.Error(),
			})
			return
		}

		response := map[string]interface{}{
			"predicted_income": 255000.0,
			"confidence":       0.85,
			"confidence_interval": map[string]float64{
				"min": 229500.0, // 255000 * 0.9
				"max": 280500.0, // 255000 * 1.1
			},
			"factors": []string{"возраст", "кредитная история"},
			"recomendations": []map[string]string{
				{
					"product": "Кредитная карта",
					"reason":  "Доход позволяет",
				},
			},
		}

		c.JSON(http.StatusOK, response)
	}
}
