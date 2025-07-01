"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Bell, Clock, AlertCircle } from "lucide-react"
import type { Order } from "@/lib/types"

interface NotificationPopupProps {
  orders: Order[]
}

export default function NotificationPopup({ orders }: NotificationPopupProps) {
  const [isOpen, setIsOpen] = useState(false)

  const pendingOrders = orders.filter((order) => ["pending", "confirmed", "preparing"].includes(order.status))

  const recentOrders = orders
    .filter((order) => {
      const orderTime = new Date(order.createdAt).getTime()
      const now = new Date().getTime()
      return now - orderTime < 30 * 60 * 1000 // 30 minutes
    })
    .slice(0, 5)

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-red-100 text-red-800"
      case "confirmed":
        return "bg-blue-100 text-blue-800"
      case "preparing":
        return "bg-orange-100 text-orange-800"
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
      default:
        return status
    }
  }

  const getTimeAgo = (date: Date) => {
    const now = new Date()
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60))

    if (diffInMinutes < 1) return "剛剛"
    if (diffInMinutes < 60) return `${diffInMinutes}分鐘前`

    const diffInHours = Math.floor(diffInMinutes / 60)
    if (diffInHours < 24) return `${diffInHours}小時前`

    return date.toLocaleDateString("zh-TW")
  }

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="relative bg-transparent">
          <Bell className="h-4 w-4 mr-2" />
          通知
          {pendingOrders.length > 0 && (
            <Badge
              variant="destructive"
              className="absolute -top-2 -right-2 h-5 w-5 p-0 flex items-center justify-center text-xs"
            >
              {pendingOrders.length}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="end">
        <Card className="border-0 shadow-lg">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Bell className="h-4 w-4" />
              通知中心
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {pendingOrders.length > 0 && (
              <div className="px-4 pb-3">
                <h4 className="text-sm font-semibold text-red-600 mb-2 flex items-center gap-1">
                  <AlertCircle className="h-4 w-4" />
                  待處理訂單 ({pendingOrders.length})
                </h4>
                <div className="space-y-2">
                  {pendingOrders.slice(0, 3).map((order) => (
                    <div key={order.id} className="flex items-center justify-between p-2 bg-red-50 rounded-lg">
                      <div>
                        <p className="text-sm font-medium">訂單 #{order.id.slice(-4)}</p>
                        <p className="text-xs text-gray-600">桌號 {order.tableNumber}</p>
                      </div>
                      <div className="text-right">
                        <Badge className={getStatusColor(order.status)} variant="secondary">
                          {getStatusText(order.status)}
                        </Badge>
                        <p className="text-xs text-gray-500 mt-1">{getTimeAgo(new Date(order.createdAt))}</p>
                      </div>
                    </div>
                  ))}
                  {pendingOrders.length > 3 && (
                    <p className="text-xs text-gray-500 text-center py-1">
                      還有 {pendingOrders.length - 3} 個待處理訂單...
                    </p>
                  )}
                </div>
              </div>
            )}

            {recentOrders.length > 0 && (
              <div className="px-4 pb-3 border-t">
                <h4 className="text-sm font-semibold text-gray-700 mb-2 mt-3 flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  最近訂單
                </h4>
                <div className="space-y-2">
                  {recentOrders.map((order) => (
                    <div key={order.id} className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-lg">
                      <div>
                        <p className="text-sm">訂單 #{order.id.slice(-4)}</p>
                        <p className="text-xs text-gray-600">
                          桌號 {order.tableNumber} | NT$ {order.totalAmount}
                        </p>
                      </div>
                      <div className="text-right">
                        <Badge className={getStatusColor(order.status)} variant="secondary">
                          {getStatusText(order.status)}
                        </Badge>
                        <p className="text-xs text-gray-500 mt-1">{getTimeAgo(new Date(order.createdAt))}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {pendingOrders.length === 0 && recentOrders.length === 0 && (
              <div className="px-4 pb-4 text-center text-gray-500">
                <Bell className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">目前沒有通知</p>
              </div>
            )}
          </CardContent>
        </Card>
      </PopoverContent>
    </Popover>
  )
}
