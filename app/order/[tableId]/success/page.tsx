"use client"

import { useState, useEffect } from "react"
import { useParams, useSearchParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { CheckCircle, Clock, ArrowLeft, Receipt, Utensils } from "lucide-react"
import type { Order } from "@/lib/types"

export default function OrderSuccessPage() {
  const params = useParams()
  const searchParams = useSearchParams()
  const tableId = params.tableId as string
  const orderId = searchParams.get("orderId")

  const [order, setOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (orderId) {
      fetchOrderDetails()
    }
  }, [orderId])

  const fetchOrderDetails = async () => {
    try {
      // In a real app, you'd have an API endpoint to get order by ID
      // For now, we'll simulate the order data
      const mockOrder: Order = {
        id: orderId!,
        restaurantId: "550e8400-e29b-41d4-a716-446655440000",
        tableNumber: tableId,
        items: JSON.parse(localStorage.getItem("lastOrder") || "[]"),
        totalAmount: Number.parseFloat(localStorage.getItem("lastOrderTotal") || "0"),
        status: "pending",
        paymentStatus: "pending",
        customerNotes: localStorage.getItem("lastOrderNotes") || "",
        createdAt: new Date(),
        updatedAt: new Date(),
      }
      setOrder(mockOrder)
    } catch (error) {
      console.error("Error fetching order details:", error)
    } finally {
      setLoading(false)
    }
  }

  const getCustomizationText = (customizations: { [key: string]: string[] }) => {
    const texts: string[] = []
    for (const [key, values] of Object.entries(customizations)) {
      if (values.length > 0) {
        // In a real app, you'd map these IDs to actual names
        texts.push(values.join(", "))
      }
    }
    return texts.join(" | ")
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-blue-50 via-sky-50 to-cyan-50">
        <div className="text-center">
          <div className="w-16 h-16 blue-gradient rounded-2xl mx-auto mb-4 flex items-center justify-center animate-pulse">
            <Utensils className="h-8 w-8 text-white" />
          </div>
          <p className="text-gray-600">載入訂單資訊...</p>
        </div>
      </div>
    )
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-sky-50 to-cyan-50 flex items-center justify-center">
        <Card className="premium-card max-w-md">
          <CardContent className="p-6 text-center">
            <p className="text-gray-600 mb-4">找不到訂單資訊</p>
            <Link href={`/order/${tableId}`}>
              <Button className="blue-gradient text-white">
                <ArrowLeft className="h-4 w-4 mr-2" />
                返回點餐
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-sky-50 to-cyan-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-md shadow-sm border-b border-blue-100/50">
        <div className="max-w-2xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href={`/order/${tableId}`}>
              <Button variant="ghost" size="sm" className="hover:bg-blue-50">
                <ArrowLeft className="h-4 w-4 mr-2" />
                返回點餐
              </Button>
            </Link>
            <Badge className="blue-gradient text-white px-4 py-2 text-base">桌號 {tableId}</Badge>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-8">
        {/* Success Message */}
        <Card className="premium-card mb-6 border-green-200 bg-gradient-to-br from-green-50 to-emerald-50">
          <CardContent className="p-6 text-center">
            <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-green-800 mb-2">訂單送出成功！</h1>
            <p className="text-green-700">您的訂單已送達廚房，我們會盡快為您準備餐點</p>
          </CardContent>
        </Card>

        {/* Order Details */}
        <Card className="premium-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Receipt className="h-5 w-5 text-blue-600" />
              訂單詳細資訊
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Order Info */}
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-600">訂單編號:</span>
                <p className="font-medium">#{order.id}</p>
              </div>
              <div>
                <span className="text-gray-600">桌號:</span>
                <p className="font-medium">{order.tableNumber}</p>
              </div>
              <div>
                <span className="text-gray-600">訂單時間:</span>
                <p className="font-medium">{order.createdAt.toLocaleString("zh-TW")}</p>
              </div>
              <div>
                <span className="text-gray-600">訂單狀態:</span>
                <Badge className="bg-blue-100 text-blue-800">
                  <Clock className="h-3 w-3 mr-1" />
                  處理中
                </Badge>
              </div>
            </div>

            <Separator />

            {/* Order Items */}
            <div>
              <h3 className="font-semibold mb-3">訂購項目</h3>
              <div className="space-y-3">
                {order.items.map((item, index) => (
                  <div key={index} className="border border-blue-100 rounded-lg p-3 bg-blue-50/30">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h4 className="font-medium">{item.menuItem.name}</h4>
                        <p className="text-sm text-gray-600">數量: {item.quantity}</p>
                      </div>
                      <p className="font-semibold text-blue-600">NT$ {item.menuItem.price * item.quantity}</p>
                    </div>

                    {Object.keys(item.customizations).length > 0 && (
                      <div className="text-sm text-gray-600 mb-2">
                        <span className="font-medium">客製化選項: </span>
                        {getCustomizationText(item.customizations)}
                      </div>
                    )}

                    {item.notes && (
                      <div className="text-sm text-gray-600">
                        <span className="font-medium">備註: </span>
                        {item.notes}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {order.customerNotes && (
              <>
                <Separator />
                <div>
                  <h3 className="font-semibold mb-2">整單備註</h3>
                  <p className="text-gray-700 bg-blue-50 p-3 rounded-lg">{order.customerNotes}</p>
                </div>
              </>
            )}

            <Separator />

            {/* Total */}
            <div className="flex justify-between items-center text-lg font-bold">
              <span>總計金額</span>
              <span className="blue-gradient bg-clip-text text-transparent text-2xl">NT$ {order.totalAmount}</span>
            </div>

            {/* Status Info */}
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
              <h3 className="font-semibold text-blue-800 mb-2">接下來會發生什麼？</h3>
              <div className="space-y-2 text-sm text-blue-700">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span>餐廳確認您的訂單</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
                  <span>廚房開始準備餐點</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
                  <span>餐點準備完成，服務生送餐</span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-4">
              <Link href={`/order/${tableId}`} className="flex-1">
                <Button variant="outline" className="w-full border-blue-200 hover:bg-blue-50 bg-transparent">
                  繼續點餐
                </Button>
              </Link>
              <Button className="flex-1 blue-gradient text-white" onClick={() => window.print()}>
                列印收據
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
