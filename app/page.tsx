import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Utensils, Smartphone, Clock, ShoppingCart, BarChart3, Settings, Star, Gift, Waves } from "lucide-react"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-sky-50 to-cyan-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md shadow-sm border-b border-blue-100/50">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 blue-gradient rounded-xl flex items-center justify-center">
                <Utensils className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                  QuickOrder
                </h1>
                <p className="text-xs text-gray-600">Smart Dining Experience</p>
              </div>
            </div>
            <nav className="flex items-center gap-4">
              <Link href="/dashboard">
                <Button variant="outline" className="bg-white/50 border-blue-200 hover:bg-blue-50">
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
            <Badge className="blue-gradient text-white px-4 py-2 text-sm font-medium mb-6">
              ✨ Smart QR Code Ordering System
            </Badge>
            <h2 className="text-6xl font-bold text-gray-900 mb-6 leading-tight">
              智慧點餐
              <span className="bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">新體驗</span>
            </h2>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
              為現代餐廳打造的智能點餐解決方案，讓顧客享受流暢便捷的用餐體驗
            </p>
          </div>

          {/* Demo QR Codes */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mt-16">
            {[
              { num: 1, gradient: "from-blue-400 to-blue-600" },
              { num: 2, gradient: "from-sky-400 to-blue-500" },
              { num: 3, gradient: "from-cyan-400 to-sky-500" },
              { num: 4, gradient: "from-teal-400 to-cyan-500" },
            ].map((table) => (
              <Card key={table.num} className="premium-card hover:scale-105 transition-all duration-300 group">
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg font-semibold text-gray-800">桌號 {table.num}</CardTitle>
                    <div className="flex">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star key={star} className="h-3 w-3 fill-blue-400 text-blue-400" />
                      ))}
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="text-center">
                  <div
                    className={`w-32 h-32 mx-auto mb-6 bg-gradient-to-br ${table.gradient} rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow`}
                  >
                    <Utensils className="h-16 w-16 text-white" />
                  </div>
                  <p className="text-sm text-gray-600 mb-4">掃描 QR Code 開始點餐</p>
                  <Link href={`/order/${table.num}`}>
                    <Button className="w-full blue-gradient text-white hover:scale-105 transition-transform shadow-lg">
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
            <h3 className="text-4xl font-bold text-gray-900 mb-4">為什麼選擇 QuickOrder？</h3>
            <p className="text-lg text-gray-600">專為現代餐廳設計的完整解決方案</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="premium-card text-center hover:scale-105 transition-all duration-300 group">
              <CardHeader>
                <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-blue-600 rounded-2xl mx-auto mb-4 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Clock className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-xl">節省等待時間</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 leading-relaxed">
                  顧客入座即可掃碼點餐，無需等待服務生，大幅縮短點餐時間，提升用餐體驗
                </p>
              </CardContent>
            </Card>

            <Card className="premium-card text-center hover:scale-105 transition-all duration-300 group">
              <CardHeader>
                <div className="w-16 h-16 bg-gradient-to-br from-sky-400 to-blue-500 rounded-2xl mx-auto mb-4 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <ShoppingCart className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-xl">即時訂單管理</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 leading-relaxed">
                  訂單直接傳送到後台，支援出單機列印，廚房作業更有效率，減少人為錯誤
                </p>
              </CardContent>
            </Card>

            <Card className="premium-card text-center hover:scale-105 transition-all duration-300 group">
              <CardHeader>
                <div className="w-16 h-16 bg-gradient-to-br from-cyan-400 to-sky-500 rounded-2xl mx-auto mb-4 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Settings className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-xl">彈性菜單管理</CardTitle>
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
              <Badge className="blue-gradient text-white px-4 py-2 text-sm font-medium mb-6">🎯 專業功能</Badge>
              <h3 className="text-4xl font-bold text-gray-900 mb-6">
                完整的餐廳
                <span className="bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                  數位化解決方案
                </span>
              </h3>
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 blue-gradient rounded-lg flex items-center justify-center flex-shrink-0">
                    <Utensils className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">客製化點餐體驗</h4>
                    <p className="text-gray-600">支援餐點客製化選項，滿足顧客個人化需求</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 blue-gradient rounded-lg flex items-center justify-center flex-shrink-0">
                    <BarChart3 className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">數據分析儀表板</h4>
                    <p className="text-gray-600">即時營收分析、熱門商品統計，助您做出明智決策</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 blue-gradient rounded-lg flex items-center justify-center flex-shrink-0">
                    <Gift className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">智慧通知系統</h4>
                    <p className="text-gray-600">即時訂單通知，確保不錯過任何一筆訂單</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-cyan-500 rounded-3xl blur-3xl opacity-20"></div>
              <Card className="premium-card relative">
                <CardContent className="p-8">
                  <div className="text-center">
                    <div className="w-20 h-20 blue-gradient rounded-3xl mx-auto mb-6 flex items-center justify-center">
                      <Waves className="h-10 w-10 text-white" />
                    </div>
                    <h4 className="text-2xl font-bold text-gray-900 mb-4">立即開始使用</h4>
                    <p className="text-gray-600 mb-6">體驗現代化的餐廳管理系統</p>
                    <div className="flex flex-col sm:flex-row gap-4">
                      <Link href="/order/1" className="flex-1">
                        <Button className="w-full blue-gradient text-white hover:scale-105 transition-transform">
                          <Smartphone className="h-4 w-4 mr-2" />
                          體驗點餐
                        </Button>
                      </Link>
                      <Link href="/dashboard" className="flex-1">
                        <Button variant="outline" className="w-full border-blue-200 hover:bg-blue-50 bg-transparent">
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
      <footer className="bg-gradient-to-r from-slate-900 to-blue-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center">
            <div className="flex items-center justify-center gap-3 mb-6">
              <div className="w-12 h-12 light-blue-gradient rounded-xl flex items-center justify-center">
                <Utensils className="h-7 w-7 text-white" />
              </div>
              <div className="text-left">
                <span className="text-2xl font-bold">QuickOrder</span>
                <p className="text-sm text-blue-200">Smart Dining Experience</p>
              </div>
            </div>
            <p className="text-blue-200 mb-8">© 2024 QuickOrder. 專為現代餐廳設計的智慧點餐系統</p>
            <div className="flex justify-center space-x-6">
              <div className="flex">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star key={star} className="h-5 w-5 fill-blue-400 text-blue-400" />
                ))}
              </div>
              <span className="text-blue-300">|</span>
              <span className="text-blue-300">Trusted by 1000+ Restaurants</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
