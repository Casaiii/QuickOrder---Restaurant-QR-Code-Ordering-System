import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Coffee, Smartphone, Clock, ShoppingCart, BarChart3, Settings, Star, Leaf } from "lucide-react"

export default function HomePage() {
  return (
    <div className="min-h-screen sage-bg">
      {/* Header */}
      <header className="bg-white/90 backdrop-blur-md shadow-sm border-b border-sage-accent/30">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 earth-gradient rounded-2xl flex items-center justify-center">
                <Coffee className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-800">QuickOrder</h1>
                <p className="text-xs text-gray-500">Natural Dining Experience</p>
              </div>
            </div>
            <nav className="flex items-center gap-4">
              <Link href="/dashboard">
                <Button variant="outline" className="bg-white/70 border-sage-accent hover:bg-sage-primary/50">
                  餐廳後台
                </Button>
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="mb-8">
            <Badge className="earth-gradient text-white px-4 py-2 text-sm font-medium mb-6 rounded-full">
              ✨ Natural QR Code Ordering System
            </Badge>
            <h2 className="text-6xl font-bold text-gray-800 mb-6 leading-tight">
              自然簡約的
              <span className="text-gray-600">智慧點餐</span>
            </h2>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
              為現代餐廳打造的優雅點餐解決方案，讓顧客享受寧靜舒適的用餐體驗
            </p>
          </div>

          {/* Demo QR Codes */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mt-16">
            {[
              { num: 1, bgClass: "bg-white" },
              { num: 2, bgClass: "sage-card" },
              { num: 3, bgClass: "bg-white" },
              { num: 4, bgClass: "sage-card" },
            ].map((table) => (
              <Card
                key={table.num}
                className={`${table.bgClass} hover:scale-105 transition-all duration-300 group border border-sage-accent/30 rounded-3xl`}
              >
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg font-semibold text-gray-800">桌號 {table.num}</CardTitle>
                    <div className="flex">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star key={star} className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="text-center">
                  <div className="w-32 h-32 mx-auto mb-6 earth-gradient rounded-3xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow">
                    <Coffee className="h-16 w-16 text-white" />
                  </div>
                  <p className="text-sm text-gray-600 mb-4">掃描 QR Code 開始點餐</p>
                  <Link href={`/order/${table.num}`}>
                    <Button className="w-full earth-button hover:earth-button text-white rounded-2xl shadow-lg">
                      <Smartphone className="h-4 w-4 mr-2" />
                      模擬掃碼點餐
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h3 className="text-4xl font-bold text-gray-800 mb-4">為什麼選擇 QuickOrder？</h3>
            <p className="text-lg text-gray-600">專為現代餐廳設計的完整解決方案</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="premium-card text-center hover:scale-105 transition-all duration-300 group rounded-3xl">
              <CardHeader>
                <div className="w-16 h-16 earth-gradient rounded-3xl mx-auto mb-4 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Clock className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-xl text-gray-800">節省等待時間</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 leading-relaxed">
                  顧客入座即可掃碼點餐，無需等待服務生，大幅縮短點餐時間，提升用餐體驗
                </p>
              </CardContent>
            </Card>

            <Card className="premium-card text-center hover:scale-105 transition-all duration-300 group rounded-3xl">
              <CardHeader>
                <div className="w-16 h-16 earth-gradient rounded-3xl mx-auto mb-4 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <ShoppingCart className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-xl text-gray-800">即時訂單管理</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 leading-relaxed">
                  訂單直接傳送到後台，支援出單機列印，廚房作業更有效率，減少人為錯誤
                </p>
              </CardContent>
            </Card>

            <Card className="premium-card text-center hover:scale-105 transition-all duration-300 group rounded-3xl">
              <CardHeader>
                <div className="w-16 h-16 earth-gradient rounded-3xl mx-auto mb-4 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Settings className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-xl text-gray-800">彈性菜單管理</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 leading-relaxed">
                  隨時更新菜單內容、價格與供應狀態，即時同步到顧客端，靈活應對營運需求
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Premium Features */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <Badge className="earth-gradient text-white px-4 py-2 text-sm font-medium mb-6 rounded-full">
                🌿 自然功能
              </Badge>
              <h3 className="text-4xl font-bold text-gray-800 mb-6">
                完整的餐廳
                <span className="text-gray-600">數位化解決方案</span>
              </h3>
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 earth-gradient rounded-2xl flex items-center justify-center flex-shrink-0">
                    <Coffee className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-2">客製化點餐體驗</h4>
                    <p className="text-gray-600">支援餐點客製化選項，滿足顧客個人化需求</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 earth-gradient rounded-2xl flex items-center justify-center flex-shrink-0">
                    <BarChart3 className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-2">數據分析儀表板</h4>
                    <p className="text-gray-600">即時營收分析、熱門商品統計，助您做出明智決策</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 earth-gradient rounded-2xl flex items-center justify-center flex-shrink-0">
                    <Leaf className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-2">智慧通知系統</h4>
                    <p className="text-gray-600">即時訂單通知，確保不錯過任何一筆訂單</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="absolute inset-0 sage-gradient rounded-3xl blur-3xl opacity-30"></div>
              <Card className="premium-card relative rounded-3xl">
                <CardContent className="p-8">
                  <div className="text-center">
                    <div className="w-20 h-20 earth-gradient rounded-3xl mx-auto mb-6 flex items-center justify-center">
                      <Leaf className="h-10 w-10 text-white" />
                    </div>
                    <h4 className="text-2xl font-bold text-gray-800 mb-4">立即開始使用</h4>
                    <p className="text-gray-600 mb-6">體驗自然優雅的餐廳管理系統</p>
                    <div className="flex flex-col sm:flex-row gap-4">
                      <Link href="/order/1" className="flex-1">
                        <Button className="w-full earth-button text-white rounded-2xl">
                          <Smartphone className="h-4 w-4 mr-2" />
                          體驗點餐
                        </Button>
                      </Link>
                      <Link href="/dashboard" className="flex-1">
                        <Button
                          variant="outline"
                          className="w-full border-sage-accent hover:bg-sage-primary/50 bg-transparent rounded-2xl"
                        >
                          <BarChart3 className="h-4 w-4 mr-2" />
                          查看後台
                        </Button>
                      </Link>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gradient-to-r from-gray-800 to-gray-700 text-white py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center">
            <div className="flex items-center justify-center gap-3 mb-6">
              <div className="w-12 h-12 earth-gradient rounded-2xl flex items-center justify-center">
                <Coffee className="h-7 w-7 text-white" />
              </div>
              <div className="text-left">
                <span className="text-2xl font-bold">QuickOrder</span>
                <p className="text-sm text-gray-300">Natural Dining Experience</p>
              </div>
            </div>
            <p className="text-gray-300 mb-8">© 2024 QuickOrder. 專為現代餐廳設計的自然點餐系統</p>
            <div className="flex justify-center space-x-6">
              <div className="flex">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star key={star} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <span className="text-gray-400">|</span>
              <span className="text-gray-400">Trusted by 1000+ Restaurants</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
