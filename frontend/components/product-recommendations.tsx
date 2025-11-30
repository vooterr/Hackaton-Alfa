import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CreditCard, Home, DollarSign, CheckCircle } from "lucide-react"

interface ProductRecommendationsProps {
  creditCardLimit: number
  loanAmount: number
  mortgageAmount: number
  approvalRate: number
}

export function ProductRecommendations({
  creditCardLimit,
  loanAmount,
  mortgageAmount,
  approvalRate,
}: ProductRecommendationsProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("ru-RU", {
      style: "currency",
      currency: "RUB",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value)
  }

  const products = [
    {
      title: "Кредитная карта",
      icon: <CreditCard className="h-5 w-5 text-primary" />,
      limit: creditCardLimit,
      description: `Лимит до ${formatCurrency(creditCardLimit)}`,
      features: ["Кэшбэк до 5%", "100 дней без %", "Бесплатное обслуживание"],
      approvalRate: approvalRate,
    },
    {
      title: "Потребительский кредит",
      icon: <DollarSign className="h-5 w-5 text-primary" />,
      limit: loanAmount,
      description: `До ${formatCurrency(loanAmount)}`,
      features: ["Ставка от 12.9%", "До 5 лет", "Без комиссий"],
      approvalRate: 0.92,
    },
    {
      title: "Ипотека",
      icon: <Home className="h-5 w-5 text-primary" />,
      limit: mortgageAmount,
      description: `Одобрено до ${formatCurrency(mortgageAmount)}`,
      features: ["Ставка от 8.5%", "До 30 лет", "Господдержка"],
      approvalRate: 0.88,
    },
  ]

  return (
    <Card className="border-border/50 bg-card/50 backdrop-blur">
      <CardHeader>
        <CardTitle className="text-foreground">Рекомендации по продуктам</CardTitle>
        <CardDescription>На основе прогнозируемого дохода и кредитного профиля</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {products.map((product, index) => (
            <div key={index} className="p-4 rounded-lg bg-background/50 border border-border/30 space-y-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                    {product.icon}
                  </div>
                </div>
                <div className="flex items-center gap-1 text-xs">
                  <CheckCircle className="h-3 w-3 text-primary" />
                  <span className="text-primary font-medium">{(product.approvalRate * 100).toFixed(0)}%</span>
                </div>
              </div>

              <div>
                <p className="font-semibold text-foreground mb-1">{product.title}</p>
                <p className="text-sm text-primary font-medium">{product.description}</p>
              </div>

              <ul className="space-y-1">
                {product.features.map((feature, idx) => (
                  <li key={idx} className="text-xs text-muted-foreground flex items-center gap-1.5">
                    <div className="w-1 h-1 rounded-full bg-primary" />
                    {feature}
                  </li>
                ))}
              </ul>

              <Button size="sm" variant="outline" className="w-full text-xs bg-transparent">
                Подробнее
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
