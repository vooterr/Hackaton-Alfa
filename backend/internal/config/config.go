package config

import "os"

type Config struct {
	Port        string
	DatabaseURL string
}

func Load() *Config {
	return &Config{
		Port:        getEnv("PORT", "8080"),
		DatabaseURL: getEnv("DATABASE_URL", "postgres://postgres:postgres@localhost:5432/alfa_income"),
	}
}

func getEnv(key, value string) string {
	if value := os.Getenv(key); value != "" {
		return value
	}
	return value
}
