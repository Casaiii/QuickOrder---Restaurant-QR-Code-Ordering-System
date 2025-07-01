"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart3, TrendingUp, PieChart } from "lucide-react"
import type { Order } from "@/lib/types"

interface DashboardChartsProps {
  orders: Order[]
}

export default function DashboardCharts({ orders }: DashboardChartsProps) {
  // Calculate hourly sales data
  const getHourlySales = () => {
    const hourlyData = Array.from({ length: 24 }, (_, i) => ({
      hour: i,
      orders: 0,
      revenue: 0,
    }))

    const today = new Date().toDateString()
    const todayOrders = orders.filter((order) => new Date(order.createdAt).toDateString() === today)

    todayOrders.forEach((order) => {
      const hour = new Date(order.createdAt).getHours()
      hourlyData[hour].orders += 1
      hourlyData[hour].revenue += order.totalAmount
    })

    return hourlyData
  }

  // Calculate popular items
  const getPopularItems = () => {
    const itemCounts: { [key: string]: { name: string; count: number; revenue: number } } = {}

    orders.forEach((order) => {
      order.items.forEach((item) => {
        const key = item.menuItem.id
        if (!itemCounts[key]) {
          itemCounts[key] = {
            name: item.menuItem.name,
            count: 0,
            revenue: 0,
          }
        }
        itemCounts[key].count += item.quantity
        itemCounts[key].revenue += item.menuItem.price * item.quantity
      })
    })

    return Object.values(itemCounts)
      .sort((a, b) => b.count - a.count)
      .slice(0, 5)
  }

  // Calculate weekly revenue
  const getWeeklyRevenue = () => {
    const weeklyData = Array.from({ length: 7 }, (_, i) => {
      const date = new Date()
      date.setDate(date.getDate() - (6 - i))
      return {
        day: date.toLocaleDateString("zh-TW", { weekday: "short" }),
        date: date.toDateString(),
        revenue: 0,
        orders: 0,
      }
    })

    orders.forEach((order) => {
      const orderDate = new Date(order.createdAt).toDateString()
      const dayData = weeklyData.find((day) => day.date === orderDate)
      if (dayData) {
        dayData.revenue += order.totalAmount
        dayData.orders += 1
      }
    })

    return weeklyData
  }

  const hourlySales = getHourlySales()
  const popularItems = getPopularItems()
  const weeklyRevenue = getWeeklyRevenue()

  const maxHourlyRevenue = Math.max(...hourlySales.map((h) => h.revenue))
  const maxWeeklyRevenue = Math.max(...weeklyRevenue.map((w) => w.revenue))
  const maxPopularCount = Math.max(...popularItems.map((item) => item.count))

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Hourly Sales Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            今日每小時營收
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {hourlySales
              .filter((hour) => hour.hour >= 8 && hour.hour <= 22)
              .map((hour) => (
                <div key={hour.hour} className="flex items-center gap-3">
                  <div className="w-12 text-sm text-gray-600">{hour.hour.toString().padStart(2, "0")}:00</div>
                  <div className="flex-1 bg-gray-200 rounded-full h-4 relative">
                    <div
                      className="bg-blue-500 h-4 rounded-full transition-all duration-300"
                      style={{
                        width: maxHourlyRevenue > 0 ? `${(hour.revenue / maxHourlyRevenue) * 100}%` : "0%",
                      }}
                    />
                  </div>
                  <div className="w-20 text-sm text-right">
                    <div className="font-medium">NT$ {hour.revenue}</div>
                    <div className="text-xs text-gray-500">{hour.orders} 單</div>
                  </div>
                </div>
              ))}
          </div>
        </CardContent>
      </Card>

      {/* Weekly Revenue Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            本週營收趨勢
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {weeklyRevenue.map((day, index) => (
              <div key={index} className="flex items-center gap-3">
                <div className="w-12 text-sm text-gray-600">{day.day}</div>
                <div className="flex-1 bg-gray-200 rounded-full h-4 relative">
                  <div
                    className="bg-green-500 h-4 rounded-full transition-all duration-300"
                    style={{
                      width: maxWeeklyRevenue > 0 ? `${(day.revenue / maxWeeklyRevenue) * 100}%` : "0%",
                    }}
                  />
                </div>
                <div className="w-20 text-sm text-right">
                  <div className="font-medium">NT$ {day.revenue}</div>
                  <div className="text-xs text-gray-500">{day.orders} 單</div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Popular Items Chart */}
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <PieChart className="h-5 w-5" />
            熱門餐點排行
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {popularItems.map((item, index) => (
              <div key={index} className="text-center">
                <div className="relative w-16 h-16 mx-auto mb-2">
                  <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center">
                    <span className="text-2xl font-bold text-gray-600">#{index + 1}</span>
                  </div>
                </div>
                <h4 className="font-medium text-sm mb-1">{item.name}</h4>
                <div className="text-xs text-gray-600">
                  <div>銷量: {item.count}</div>
                  <div>營收: NT$ {item.revenue}</div>
                </div>
                <div className="mt-2 bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-orange-500 h-2 rounded-full transition-all duration-300"
                    style={{
                      width: maxPopularCount > 0 ? `${(item.count / maxPopularCount) * 100}%` : "0%",
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
