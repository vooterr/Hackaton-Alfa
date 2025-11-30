"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ArrowRight, TrendingUp, Users, DollarSign, Target, Search } from "lucide-react"
import { StatsCard } from "@/components/stats-card"
import { CurvedLines } from "@/components/curved-lines"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { searchClient } from "@/lib/api"

export default function Dashboard() {
  const [searchQuery, setSearchQuery] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      setError("Введите ID или имя клиента")
      return
    }

    try {
      setLoading(true)
      setError("")
      const client = await searchClient(searchQuery.trim())
      
      if (client) {
        router.push(`/client/${client.id}`)
      } else {
        setError("Клиент не найден")
      }
    } catch (err) {
      setError("Ошибка поиска")
      console.error('Search error:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch()
    }
  }

  return (
    <div className="min-h-screen bg-background grid-bg">
      <CurvedLines />

      <header className="border-b border-border/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-lg">α</span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">AlphaPredict AI</h1>
              <p className="text-xs text-muted-foreground">Прогнозирование доходов клиентов</p>
            </div>
          </div>

          <nav className="flex items-center gap-6">
            <Link href="/" className="text-sm font-medium text-primary">
              Дашборд
            </Link>
            <Link
              href="/clients"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition"
            >
              База клиентов
            </Link>
            <Link
              href="/analytics"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition"
            >
              Аналитика
            </Link>
          </nav>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12 relative">
          <h2 className="text-5xl font-bold text-foreground mb-4 text-balance">Прогноз который вы получите</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Система ML-прогнозирования доходов с точностью 94.2% на основе 150+ параметров
          </p>
        </div>

        {/* Quick Search */}
        <Card className="mb-8 border-border/50 bg-card/50 backdrop-blur">
          <CardContent className="pt-6">
            <div className="flex gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input 
                  placeholder="Поиск клиента по ID или имени..." 
                  className="pl-10 bg-background/50"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value)
                    setError("")
                  }}
                  onKeyPress={handleKeyPress}
                  disabled={loading}
                />
              </div>
              <Button 
                onClick={handleSearch} 
                disabled={loading}
                className="bg-primary hover:bg-primary/90"
              >
                {loading ? "Поиск..." : "Найти"}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
            {error && (
              <p className="text-sm text-destructive mt-2">{error}</p>
            )}
            <p className="text-xs text-muted-foreground mt-2">
              Введите ID клиента или часть имени для поиска
            </p>
          </CardContent>
        </Card>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatsCard
            title="Всего клиентов"
            value="15,247"
            description="+12.5% за месяц"
            icon={<Users className="h-5 w-5 text-primary" />}
            trend="up"
          />
          <StatsCard
            title="Средний доход"
            value="₽85,430"
            description="Предсказанный"
            icon={<DollarSign className="h-5 w-5 text-primary" />}
          />
          <StatsCard
            title="Точность модели"
            value="94.2%"
            description="v3.0 • 150+ параметров"
            icon={<Target className="h-5 w-5 text-primary" />}
            trend="up"
          />
          <StatsCard
            title="Прогнозов сегодня"
            value="1,543"
            description="+8.2% к вчера"
            icon={<TrendingUp className="h-5 w-5 text-primary" />}
            trend="up"
          />
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Link href="/clients">
            <Card className="border-border/50 bg-card/50 backdrop-blur hover:bg-card/70 transition cursor-pointer group h-full">
              <CardHeader>
                <CardTitle className="text-foreground flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Search className="h-4 w-4 text-primary" />
                  </div>
                  Профиль клиента
                </CardTitle>
                <CardDescription>
                  Найдите клиента по ID или имени для просмотра прогноза дохода и рекомендаций
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="ghost" className="w-full group-hover:bg-primary/10">
                  Найти клиента
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          </Link>

          <Link href="/clients">
            <Card className="border-border/50 bg-card/50 backdrop-blur hover:bg-card/70 transition cursor-pointer group h-full">
              <CardHeader>
                <CardTitle className="text-foreground flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Users className="h-4 w-4 text-primary" />
                  </div>
                  База клиентов
                </CardTitle>
                <CardDescription>Управляйте базой клиентов, сегментация и групповые операции</CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="ghost" className="w-full group-hover:bg-primary/10">
                  Перейти к базе
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          </Link>

          <Link href="/analytics">
            <Card className="border-border/50 bg-card/50 backdrop-blur hover:bg-card/70 transition cursor-pointer group h-full">
              <CardHeader>
                <CardTitle className="text-foreground flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                    <TrendingUp className="h-4 w-4 text-primary" />
                  </div>
                  Аналитика
                </CardTitle>
                <CardDescription>Мониторинг модели, сегментация клиентов и бизнес-отчеты</CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="ghost" className="w-full group-hover:bg-primary/10">
                  Смотреть аналитику
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          </Link>
        </div>

        {/* Recent Predictions */}
        <Card className="border-border/50 bg-card/50 backdrop-blur">
          <CardHeader>
            <CardTitle className="text-foreground">Последние прогнозы</CardTitle>
            <CardDescription>Обновлено 2 минуты назад</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                {
                  id: "12345",
                  name: "Иванов Иван Иванович",
                  income: "₽127,500",
                  confidence: "85%",
                  segment: "Премиум",
                },
                {
                  id: "12346",
                  name: "Петрова Мария Сергеевна",
                  income: "₽89,200",
                  confidence: "92%",
                  segment: "Стандарт",
                },
                {
                  id: "12347",
                  name: "Сидоров Петр Александрович",
                  income: "₽156,800",
                  confidence: "88%",
                  segment: "VIP",
                },
              ].map((client) => (
                <Link key={client.id} href={`/client/${client.id}`}>
                  <div className="flex items-center justify-between p-4 rounded-lg bg-background/50 hover:bg-background/70 transition border border-border/30 cursor-pointer group">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <span className="text-sm font-semibold text-primary">{client.name[0]}</span>
                      </div>
                      <div>
                        <p className="font-medium text-foreground">{client.name}</p>
                        <p className="text-sm text-muted-foreground">ID: {client.id}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-6">
                      <div className="text-right">
                        <p className="font-semibold text-foreground">{client.income}</p>
                        <p className="text-sm text-muted-foreground">Доверие: {client.confidence}</p>
                      </div>
                      <div className="px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium">
                        {client.segment}
                      </div>
                      <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}