package main

import (
	"hakaton-backend/internal/config"
	"hakaton-backend/internal/handlers"
	"hakaton-backend/pkg/database"
)

func main() {
	c := config.Load()

	db, err := database.ConnectToDB(c.DatabaseURL)
	if err != nil {
		panic("error while connecting to database" + err.Error())

	}

	router := handlers.SetupRoute(db)
	router.Run(":" + c.Port)

}
