package models

import (
	"gorm.io/gorm"
)

type Client struct {
	gorm.Model
	ID        uint    `gorm:"primaryKey" json:"id"`
	FirstName string  `json:"first_name"`
	LastName  string  `json:"last_name"`
	Age       int     `json:"age"`
	Income    float64 `json:"income"`
	Region    string  `json:"region"`
}
