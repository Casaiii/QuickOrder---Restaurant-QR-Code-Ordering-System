"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Clock, DollarSign, ShoppingBag, Users, CheckCircle, XCircle, AlertCircle } from "lucide-react"
import type { Order, MenuItem } from "@/lib/types"
import NotificationPopup from "@/components/notification-popup"
import DashboardCharts from "@/components/dashboard-charts"
import MenuManagement from "@/components/menu-management"

export default function Dashboard() {
  const [orders, setOrders] = useState<Order[]>([])
  const [menuItems, setMenuItems] = useState<MenuItem[]>([])
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    todayOrders: 0,
    todayRevenue: 0,
    pendingOrders: 0,
    completedOrders: 0,
  })
  const [categories, setCategories] = useState<any[]>([])

  const restaurantId = "550e8400-e29b-41d4-a716-446655440000"

  useEffect(() => {
    fetchDashboardData()
    // Set up polling for real-time updates
    const interval = setInterval(fetchDashboardData, 5000)
    return () => clearInterval(interval)
  }, [])

  const fetchDashboardData = async () => {
    try {
      const [ordersResponse, menuResponse] = await Promise.all([
        fetch(`/api/orders?restaurantId=${restaurantId}`),
        fetch(`/api/menu?restaurantId=${restaurantId}`),
      ])

      const ordersData = await ordersResponse.json()
      const menuData = await menuResponse.json()

      setOrders(ordersData)
      setCategories(menuData)

      // Flatten menu items
      const allMenuItems = menuData.flatMap((category: any) => category.items)
      setMenuItems(allMenuItems)

      // Calculate stats
      const today = new Date().toDateString()
      const todayOrders = ordersData.filter((order: Order) => new Date(order.createdAt).toDateString() === today)

      setStats({
        todayOrders: todayOrders.length,
        todayRevenue: todayOrders.reduce((sum: number, order: Order) => sum + order.totalAmount, 0),
        pendingOrders: ordersData.filter((order: Order) => ["pending", "confirmed", "preparing"].includes(order.status))
          .length,
        completedOrders: ordersData.filter((order: Order) => order.status === "completed").length,
      })
    } catch (error) {
      console.error("Error fetching dashboard data:", error)
    } finally {
      setLoading(false)
    }
  }

  const updateOrderStatus = async (orderId: string, status: string) => {
    try {
      const response = await fetch(`/api/orders/${orderId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status }),
      })

      if (response.ok) {
        fetchDashboardData()
      }
    } catch (error) {
      console.error("Error updating order status:", error)
    }
  }

  const toggleMenuItemAvailability = async (itemId: string, isAvailable: boolean) => {
    try {
      const response = await fetch(`/api/menu/${itemId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ isAvailable }),
      })

      if (response.ok) {
        fetchDashboardData()
      }
    } catch (error) {
      console.error("Error updating menu item:", error)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "confirmed":
        return "bg-blue-100 text-blue-800"
      case "preparing":
        return "bg-orange-100 text-orange-800"
      case "ready":
        return "bg-green-100 text-green-800"
      case "completed":
        return "bg-gray-100 text-gray-800"
      case "cancelled":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "pending":
        return "待確認"
      case "confirmed":
        return "已確認"
      case "preparing":
        return "準備中"
      case "ready":
        return "已完成"
      case "completed":
        return "已送達"
      case "cancelled":
        return "已取消"
      default:
        return status
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900">美味小館 - 後台管理</h1>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-green-600">
                營業中
              </Badge>
              <NotificationPopup orders={orders} />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">今日訂單</CardTitle>
              <ShoppingBag className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.todayOrders}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">今日營收</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">NT$ {stats.todayRevenue}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">待處理訂單</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">{stats.pendingOrders}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">已完成訂單</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{stats.completedOrders}</div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="orders" className="space-y-4">
          <TabsList>
            <TabsTrigger value="orders">訂單管理</TabsTrigger>
            <TabsTrigger value="analytics">數據分析</TabsTrigger>
            <TabsTrigger value="menu">菜單管理</TabsTrigger>
          </TabsList>

          <TabsContent value="orders" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>即時訂單</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {orders.length === 0 ? (
                    <p className="text-center text-gray-500 py-8">目前沒有訂單</p>
                  ) : (
                    orders.map((order) => (
                      <Card key={order.id} className="border-l-4 border-l-blue-500">
                        <CardContent className="p-4">
                          <div className="flex justify-between items-start mb-3">
                            <div>
                              <div className="flex items-center gap-2 mb-1">
                                <span className="font-semibold">訂單 #{order.id}</span>
                                <Badge className={getStatusColor(order.status)}>{getStatusText(order.status)}</Badge>
                              </div>
                              <p className="text-sm text-gray-600">
                                桌號: {order.tableNumber} | 時間: {new Date(order.createdAt).toLocaleString("zh-TW")}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="font-bold text-lg">NT$ {order.totalAmount}</p>
                            </div>
                          </div>

                          <div className="mb-3">
                            <h4 className="font-medium mb-2">訂單內容:</h4>
                            <div className="space-y-1">
                              {order.items.map((item, index) => (
                                <div key={index} className="flex justify-between text-sm">
                                  <span>
                                    {item.menuItem.name} x {item.quantity}
                                  </span>
                                  <span>NT$ {item.menuItem.price * item.quantity}</span>
                                </div>
                              ))}
                            </div>
                          </div>

                          {order.customerNotes && (
                            <div className="mb-3">
                              <p className="text-sm text-gray-600">
                                <strong>備註:</strong> {order.customerNotes}
                              </p>
                            </div>
                          )}

                          <div className="flex gap-2">
                            {order.status === "pending" && (
                              <Button size="sm" onClick={() => updateOrderStatus(order.id, "confirmed")}>
                                <CheckCircle className="h-4 w-4 mr-1" />
                                確認訂單
                              </Button>
                            )}
                            {order.status === "confirmed" && (
                              <Button size="sm" onClick={() => updateOrderStatus(order.id, "preparing")}>
                                <Clock className="h-4 w-4 mr-1" />
                                開始準備
                              </Button>
                            )}
                            {order.status === "preparing" && (
                              <Button size="sm" onClick={() => updateOrderStatus(order.id, "ready")}>
                                <AlertCircle className="h-4 w-4 mr-1" />
                                準備完成
                              </Button>
                            )}
                            {order.status === "ready" && (
                              <Button size="sm" onClick={() => updateOrderStatus(order.id, "completed")}>
                                <CheckCircle className="h-4 w-4 mr-1" />
                                已送達
                              </Button>
                            )}
                            {["pending", "confirmed"].includes(order.status) && (
                              <Button
                                size="sm"
                                variant="destructive"
                                onClick={() => updateOrderStatus(order.id, "cancelled")}
                              >
                                <XCircle className="h-4 w-4 mr-1" />
                                取消訂單
                              </Button>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-4">
            <DashboardCharts orders={orders} />
          </TabsContent>

          <TabsContent value="menu" className="space-y-4">
            <Card>
              <CardContent className="p-6">
                <MenuManagement menuItems={menuItems} categories={categories} onRefresh={fetchDashboardData} />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
