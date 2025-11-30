"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Brain, TrendingUp, TrendingDown } from "lucide-react"
import { Progress } from "@/components/ui/progress"

interface ShapFeature {
  feature: string
  impact: number
  value: string
  direction: "positive" | "negative"
}

interface ShapExplainerProps {
  data: ShapFeature[]
  predictedIncome: number
}

export function ShapExplainer({ data, predictedIncome }: ShapExplainerProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("ru-RU", {
      style: "currency",
      currency: "RUB",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value)
  }

  const positiveFactors = data.filter((f) => f.direction === "positive")
  const negativeFactors = data.filter((f) => f.direction === "negative")

  return (
    <Card className="border-border/50 bg-card/50 backdrop-blur">
      <CardHeader>
        <CardTitle className="text-foreground flex items-center gap-2">
          <Brain className="h-5 w-5 text-primary" />
          SHAP-анализ факторов
        </CardTitle>
        <CardDescription>Объяснение прогноза дохода {formatCurrency(predictedIncome)}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Human-readable explanation */}
          <div className="p-4 rounded-lg bg-primary/5 border border-primary/20">
            <p className="text-sm text-foreground mb-3 font-medium">Доход клиента прогнозируется высоким потому что:</p>
            <ul className="space-y-2 text-sm">
              {positiveFactors.map((factor, index) => (
                <li key={index} className="flex items-start gap-2 text-muted-foreground">
                  <span className="text-primary mt-0.5">✓</span>
                  <span>
                    <span className="font-medium text-foreground">{factor.feature}</span> ({factor.value}) повышает на{" "}
                    <span className="font-semibold text-primary">+{factor.impact}%</span>
                  </span>
                </li>
              ))}
              {negativeFactors.length > 0 && (
                <>
                  {negativeFactors.map((factor, index) => (
                    <li key={index} className="flex items-start gap-2 text-muted-foreground">
                      <span className="text-destructive mt-0.5">⚠</span>
                      <span>
                        <span className="font-medium text-foreground">{factor.feature}</span> ({factor.value}) снижает
                        на <span className="font-semibold text-destructive">{factor.impact}%</span>
                      </span>
                    </li>
                  ))}
                </>
              )}
            </ul>
          </div>

          {/* Visual SHAP chart */}
          <div className="space-y-3">
            <p className="text-sm font-medium text-foreground">Влияние факторов на прогноз:</p>
            {data.map((feature, index) => (
              <div key={index} className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    {feature.direction === "positive" ? (
                      <TrendingUp className="h-4 w-4 text-primary" />
                    ) : (
                      <TrendingDown className="h-4 w-4 text-destructive" />
                    )}
                    <span className="text-foreground font-medium">{feature.feature}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-muted-foreground text-xs">{feature.value}</span>
                    <span
                      className={`font-semibold ${feature.direction === "positive" ? "text-primary" : "text-destructive"}`}
                    >
                      {feature.direction === "positive" ? "+" : ""}
                      {feature.impact}%
                    </span>
                  </div>
                </div>
                <Progress
                  value={Math.abs(feature.impact) * 4}
                  className={`h-2 ${feature.direction === "negative" ? "[&>div]:bg-destructive" : ""}`}
                />
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
