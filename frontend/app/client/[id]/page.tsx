import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { ArrowLeft, TrendingUp, AlertCircle } from "lucide-react"
import { IncomePredictionWidget } from "@/components/income-prediction-widget"
import { ShapExplainer } from "@/components/shap-explainer"
import { ProductRecommendations } from "@/components/product-recommendations"
import { CurvedLines } from "@/components/curved-lines"
import { fetchClientById } from "@/lib/api"

interface Client {
  id: string;
  name: string;
  income: number;
  segment: string;
  score: number;
  region: string;
  age?: number;
  education?: string;
  experience?: number;
  maritalStatus?: string;
}

export default async function ClientProfile({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  
  let clientData: Client | null = null
  let loading = false

  try {
    clientData = await fetchClientById(id)
  } catch (error) {
    console.error('Error loading client:', error)
    clientData = null
  }

  if (!clientData) {
    return (
      <div className="min-h-screen bg-background grid-bg">
        <CurvedLines />
        <div className="container mx-auto px-4 py-8 flex justify-center items-center">
          <div className="text-center">
            <p className="text-foreground text-lg mb-4">Клиент не найден</p>
            <Link href="/clients">
              <Button>Вернуться к списку клиентов</Button>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  const shapData = [
    { feature: "Стаж работы", impact: 23, value: "7+ лет", direction: "positive" },
    { feature: "Высшее образование", impact: 15, value: "Да", direction: "positive" },
    { feature: "Регион", impact: 12, value: "Москва", direction: "positive" },
    { feature: "Возраст", impact: -8, value: "35 лет", direction: "negative" },
    { feature: "Кредитная история", impact: 10, value: "Отличная", direction: "positive" },
  ]

  const predictedIncome = clientData.income * 1.34 
  const confidenceInterval = {
    min: predictedIncome * 0.9, 
    max: predictedIncome * 1.1 
  }

  return (
    <div className="min-h-screen bg-background grid-bg">
      <CurvedLines />

      <header className="border-b border-border/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/clients">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
            <div>
              <h1 className="text-xl font-bold text-foreground">Профиль клиента</h1>
              <p className="text-xs text-muted-foreground">ID: {clientData.id}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
              {clientData.segment}
            </Badge>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Client Info */}
          <div className="space-y-6">
            <Card className="border-border/50 bg-card/50 backdrop-blur">
              <CardHeader>
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="text-2xl font-semibold text-primary">{clientData.name[0]}</span>
                  </div>
                  <div>
                    <CardTitle className="text-foreground">{clientData.name}</CardTitle>
                    <CardDescription>
                      {clientData.age || 'Не указан'} лет • {clientData.region}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Текущий доход</span>
                    <span className="text-foreground font-medium">
                      {new Intl.NumberFormat("ru-RU", {
                        style: "currency",
                        currency: "RUB",
                        minimumFractionDigits: 0,
                      }).format(clientData.income)}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Сегмент</span>
                    <span className="text-foreground font-medium">{clientData.segment}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Кредитный рейтинг</span>
                    <span className="text-foreground font-medium">{clientData.score}/10</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Регион</span>
                    <span className="text-foreground font-medium">{clientData.region}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <IncomePredictionWidget
              clientId={clientData.id}
              currentIncome={clientData.income}
            />
          </div>

          {/* Middle Column - SHAP Analysis */}
          <div className="lg:col-span-2 space-y-6">
            <ShapExplainer data={shapData} predictedIncome={predictedIncome} />

            {/* Comparative Analysis */}
            <Card className="border-border/50 bg-card/50 backdrop-blur">
              <CardHeader>
                <CardTitle className="text-foreground flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-primary" />
                  Сравнительная аналитика
                </CardTitle>
                <CardDescription>Позиция клиента относительно сегмента</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-muted-foreground">Позиция в сегменте "{clientData.segment}"</span>
                      <span className="text-foreground font-semibold">Топ 15%</span>
                    </div>
                    <Progress value={85} className="h-2" />
                  </div>

                  <div className="grid grid-cols-3 gap-4 pt-4">
                    <div className="text-center">
                      <p className="text-2xl font-bold text-foreground">
                        {new Intl.NumberFormat("ru-RU", {
                          style: "currency",
                          currency: "RUB",
                          minimumFractionDigits: 0,
                        }).format(predictedIncome)}
                      </p>
                      <p className="text-xs text-muted-foreground">Ваш клиент</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-muted-foreground">
                        {new Intl.NumberFormat("ru-RU", {
                          style: "currency",
                          currency: "RUB",
                          minimumFractionDigits: 0,
                        }).format(clientData.income * 0.8)}
                      </p>
                      <p className="text-xs text-muted-foreground">Средний в сегменте</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-muted-foreground">
                        {new Intl.NumberFormat("ru-RU", {
                          style: "currency",
                          currency: "RUB",
                          minimumFractionDigits: 0,
                        }).format(clientData.income * 1.5)}
                      </p>
                      <p className="text-xs text-muted-foreground">Топ в сегменте</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <ProductRecommendations
              creditCardLimit={500000}
              loanAmount={2000000}
              mortgageAmount={8500000}
              approvalRate={0.95}
            />

            {/* Stimulation Section */}
            <Card className="border-border/50 bg-card/50 backdrop-blur border-primary/20">
              <CardHeader>
                <CardTitle className="text-foreground flex items-center gap-2">
                  <AlertCircle className="h-5 w-5 text-primary" />
                  Стимуляция клиента
                </CardTitle>
                <CardDescription>Что получит клиент при увеличении дохода</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 rounded-lg bg-primary/5 border border-primary/20">
                    <p className="text-sm text-foreground mb-3">
                      <span className="font-semibold">При увеличении дохода на 20%</span> (до {new Intl.NumberFormat("ru-RU", {
                        style: "currency",
                        currency: "RUB",
                        minimumFractionDigits: 0,
                      }).format(clientData.income * 1.2)}):
                    </p>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-center gap-2 text-muted-foreground">
                        <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                        Кредитная карта с кэшбэком 10%
                      </li>
                      <li className="flex items-center gap-2 text-muted-foreground">
                        <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                        Премиальный пакет услуг бесплатно
                      </li>
                      <li className="flex items-center gap-2 text-muted-foreground">
                        <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                        Доступ к VIP-консультанту
                      </li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}