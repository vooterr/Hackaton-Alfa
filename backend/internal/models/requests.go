package models

type Request struct {
	CliendID string                 `json:"client_id"`
	Features map[string]interface{} `json:"featuers"`
}

type Responce struct {
	PredictedIncome float64         `json:"predicted_income"`
	Confidence      float64         `json:"confidence"`
	Factors         []string        `json:"factors"`
	Recomendations  []Recomendation `json:"recomendations"`
}

type Recomendation struct {
	Product string `json:"product"`
	Reason  string `json:"reason"`
}
