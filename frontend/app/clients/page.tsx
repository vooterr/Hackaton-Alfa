"use client" 

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Search, Plus, Filter, Download } from "lucide-react"
import { CurvedLines } from "@/components/curved-lines"
import { fetchClients, searchClients } from "@/lib/api"
import { useEffect, useState } from "react"

interface Client {
  id: string;
  name: string;
  income: number;
  segment: string;
  score: number;
  region: string;
}

export default function ClientsDatabase() {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSegment, setSelectedSegment] = useState("all");

  useEffect(() => {
    loadClients();
  }, []);

  const loadClients = async () => {
    try {
      setLoading(true);
      const data = await fetchClients();
      setClients(data || []);
    } catch (error) {
      console.error('Error loading clients:', error);
      setClients([]);
    } finally {
      setLoading(false);
    }
};

  const handleSearch = async () => {
  try {
    setLoading(true);
    const data = await searchClients(searchQuery, selectedSegment);
    setClients(data || []);
  } catch (error) {
    console.error('Error searching clients:', error);
    setClients([]);
  } finally {
    setLoading(false);
  }
};

  if (loading) {
    return (
      <div className="min-h-screen bg-background grid-bg">
        <CurvedLines />
        <div className="container mx-auto px-4 py-8 flex justify-center items-center">
          <p className="text-foreground">Загрузка клиентов...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background grid-bg">
      <CurvedLines />

      <header className="border-b border-border/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
            <div>
              <h1 className="text-xl font-bold text-foreground">База клиентов</h1>
              <p className="text-xs text-muted-foreground">{clients.length} клиентов в базе</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Экспорт
            </Button>
            <Link href="/client/new">
              <Button size="sm" className="bg-primary hover:bg-primary/90">
                <Plus className="h-4 w-4 mr-2" />
                Добавить клиента
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <Card className="border-border/50 bg-card/50 backdrop-blur mb-6">
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input 
                  placeholder="Поиск по имени, ID, региону..." 
                  className="pl-10 bg-background/50"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                />
              </div>

              <div className="flex gap-2">
                <Select value={selectedSegment} onValueChange={setSelectedSegment}>
                  <SelectTrigger className="w-[180px] bg-background/50">
                    <SelectValue placeholder="Сегмент" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Все сегменты</SelectItem>
                    <SelectItem value="VIP">VIP</SelectItem>
                    <SelectItem value="Премиум">Премиум</SelectItem>
                    <SelectItem value="Стандарт">Стандарт</SelectItem>
                    <SelectItem value="Базовый">Базовый</SelectItem>
                  </SelectContent>
                </Select>

                <Button onClick={handleSearch} className="bg-primary hover:bg-primary/90">
                  <Filter className="h-4 w-4 mr-2" />
                  Применить
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/50 bg-card/50 backdrop-blur">
          <CardHeader>
            <CardTitle className="text-foreground">Список клиентов</CardTitle>
            <CardDescription>Все клиенты с прогнозами дохода</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {clients.map((client) => (
                <Link key={client.id} href={`/client/${client.id}`}>
                  <div className="flex items-center justify-between p-4 rounded-lg bg-background/50 hover:bg-background/70 transition border border-border/30 cursor-pointer group">
                    <div className="flex items-center gap-4 flex-1">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <span className="text-sm font-semibold text-primary">{client.name[0]}</span>
                      </div>

                      <div className="flex-1">
                        <p className="font-medium text-foreground group-hover:text-primary transition">{client.name}</p>
                        <p className="text-sm text-muted-foreground">
                          ID: {client.id} • {client.region}
                        </p>
                      </div>

                      <div className="hidden md:flex items-center gap-8">
                        <div className="text-right">
                          <p className="text-sm text-muted-foreground">Прогноз дохода</p>
                          <p className="font-semibold text-foreground">
                            {new Intl.NumberFormat("ru-RU", {
                              style: "currency",
                              currency: "RUB",
                              minimumFractionDigits: 0,
                            }).format(client.income)}
                          </p>
                        </div>

                        <div className="text-right">
                          <p className="text-sm text-muted-foreground">Рейтинг</p>
                          <p className="font-semibold text-foreground">{client.score}/10</p>
                        </div>

                        <Badge
                          variant="outline"
                          className={`
                            ${client.segment === "VIP" ? "bg-primary/20 text-primary border-primary/30" : ""}
                            ${client.segment === "Премиум" ? "bg-primary/10 text-primary border-primary/20" : ""}
                            ${client.segment === "Стандарт" ? "bg-muted text-foreground border-border" : ""}
                            ${client.segment === "Базовый" ? "bg-muted/50 text-muted-foreground border-border" : ""}
                          `}
                        >
                          {client.segment}
                        </Badge>
                      </div>
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