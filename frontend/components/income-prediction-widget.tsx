"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { DollarSign, TrendingUp, RefreshCw } from "lucide-react"
import { Progress } from "@/components/ui/progress"
import { predictIncome } from "@/lib/api"
import { useState, useEffect } from "react"

interface IncomePredictionWidgetProps {
  clientId: string
  currentIncome?: number
}

interface PredictionResponse {
  predicted_income: number
  confidence: number
  confidence_interval: { min: number; max: number }
  factors: string[]
  recomendations: Array<{ product: string; reason: string }>
}

export function IncomePredictionWidget({
  clientId,
  currentIncome,
}: IncomePredictionWidgetProps) {
  const [prediction, setPrediction] = useState<PredictionResponse | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const loadPrediction = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await predictIncome(clientId)
      setPrediction(data)
    } catch (err) {
      setError('Ошибка загрузки прогноза')
      console.error('Prediction error:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadPrediction()
  }, [clientId])

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("ru-RU", {
      style: "currency",
      currency: "RUB",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value)
  }

  const displayData = prediction || {
    predicted_income: currentIncome ? currentIncome * 1.34 : 255000,
    confidence: 0.85,
    confidence_interval: { min: 229500, max: 280500 },
    factors: ["возраст", "кредитная история"],
    recomendations: [{ product: "Кредитная карта", reason: "Доход позволяет" }]
  }

  const change = currentIncome ? ((displayData.predicted_income - currentIncome) / currentIncome) * 100 : 0

  return (
    <Card className="border-primary/30 bg-gradient-to-br from-card/50 to-primary/5 backdrop-blur">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-foreground flex items-center gap-2">
            <DollarSign className="h-5 w-5 text-primary" />
            Прогноз дохода
          </CardTitle>
          <button 
            onClick={loadPrediction} 
            disabled={loading}
            className="p-1 hover:bg-primary/10 rounded transition"
          >
            <RefreshCw className={`h-4 w-4 text-primary ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
        <CardDescription>ML-модель v3.0 • {prediction ? 'Реальные данные' : 'Моковые данные'}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {error && (
            <div className="p-2 bg-destructive/10 border border-destructive/20 rounded text-destructive text-sm">
              {error}
            </div>
          )}

          <div>
            <p className="text-4xl font-bold text-foreground mb-1">
              {formatCurrency(displayData.predicted_income)}
            </p>
            <p className="text-sm text-muted-foreground">
              Диапазон: {formatCurrency(displayData.confidence_interval.min)} - {formatCurrency(displayData.confidence_interval.max)}
            </p>
          </div>

          {currentIncome && change !== 0 && (
            <div className="flex items-center gap-2 p-3 rounded-lg bg-primary/10">
              <TrendingUp className="h-4 w-4 text-primary" />
              <span className="text-sm text-foreground">
                <span className="font-semibold text-primary">+{change.toFixed(1)}%</span> к текущему доходу
              </span>
            </div>
          )}

          <div>
            <div className="flex justify-between text-sm mb-2">
              <span className="text-muted-foreground">Доверительный интервал</span>
              <span className="text-foreground font-semibold">{(displayData.confidence * 100).toFixed(0)}%</span>
            </div>
            <Progress value={displayData.confidence * 100} className="h-2" />
          </div>

          {/* Факторы влияния */}
          {displayData.factors && displayData.factors.length > 0 && (
            <div className="pt-2">
              <p className="text-sm text-muted-foreground mb-2">Ключевые факторы:</p>
              <div className="flex flex-wrap gap-1">
                {displayData.factors.map((factor, index) => (
                  <span key={index} className="px-2 py-1 bg-primary/10 text-primary text-xs rounded">
                    {factor}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className="pt-2 border-t border-border/30">
            <p className="text-xs text-muted-foreground">
              {prediction 
                ? `Реальное предсказание • ${new Date().toLocaleDateString("ru-RU")}`
                : 'Моковые данные • Загрузка реальных...'
              }
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}