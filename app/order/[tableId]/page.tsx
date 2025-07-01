"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ShoppingCart, Plus, Minus, Clock, MapPin, Phone, Edit2, Star, Utensils } from "lucide-react"
import Image from "next/image"
import type { CartItem, MenuItem, Category, Restaurant } from "@/lib/types"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import CustomizationModal from "@/components/customization-modal"

interface MenuCategory extends Category {
  items: MenuItem[]
}

export default function OrderPage() {
  const params = useParams()
  const tableId = params.tableId as string

  const router = useRouter()
  const [editableTableNumber, setEditableTableNumber] = useState(tableId)
  const [isEditingTable, setIsEditingTable] = useState(false)
  const [orderNotes, setOrderNotes] = useState("")

  const [restaurant, setRestaurant] = useState<Restaurant | null>(null)
  const [menu, setMenu] = useState<MenuCategory[]>([])
  const [cart, setCart] = useState<CartItem[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState<string>("")

  useEffect(() => {
    fetchMenuData()
  }, [])

  const fetchMenuData = async () => {
    try {
      // In a real app, you'd get restaurant ID from table QR code
      const restaurantId = "550e8400-e29b-41d4-a716-446655440000"

      const [menuResponse] = await Promise.all([fetch(`/api/menu?restaurantId=${restaurantId}`)])

      const menuData = await menuResponse.json()
      setMenu(menuData)

      if (menuData.length > 0) {
        setSelectedCategory(menuData[0].id)
      }

      // Mock restaurant data
      setRestaurant({
        id: restaurantId,
        name: "美味小館",
        description: "提供道地台式料理，新鮮食材，用心烹調",
        address: "台北市大安區復興南路一段100號",
        phone: "02-2345-6789",
        isOpen: true,
        businessHours: { open: "11:00", close: "21:00" },
      })
    } catch (error) {
      console.error("Error fetching menu:", error)
    } finally {
      setLoading(false)
    }
  }

  const addToCart = (menuItem: MenuItem, customizations: { [key: string]: string[] } = {}, notes?: string) => {
    const existingItemIndex = cart.findIndex(
      (item) =>
        item.menuItem.id === menuItem.id &&
        JSON.stringify(item.customizations) === JSON.stringify(customizations) &&
        item.notes === notes,
    )

    if (existingItemIndex >= 0) {
      const newCart = [...cart]
      newCart[existingItemIndex].quantity += 1
      setCart(newCart)
    } else {
      setCart([
        ...cart,
        {
          menuItem,
          quantity: 1,
          customizations,
          notes,
        },
      ])
    }
  }

  const updateCartItemQuantity = (index: number, quantity: number) => {
    if (quantity <= 0) {
      setCart(cart.filter((_, i) => i !== index))
    } else {
      const newCart = [...cart]
      newCart[index].quantity = quantity
      setCart(newCart)
    }
  }

  const getTotalAmount = () => {
    return cart.reduce((total, item) => {
      const customizationPrice = Object.values(item.customizations)
        .flat()
        .reduce((sum, optionId) => {
          // In a real app, you'd calculate customization prices
          return sum
        }, 0)
      return total + (item.menuItem.price + customizationPrice) * item.quantity
    }, 0)
  }

  const submitOrder = async () => {
    try {
      const orderData = {
        restaurantId: restaurant?.id,
        tableNumber: editableTableNumber,
        items: cart,
        totalAmount: getTotalAmount(),
        customerNotes: orderNotes,
      }

      const response = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(orderData),
      })

      if (response.ok) {
        const order = await response.json()
        // Store order data for success page
        localStorage.setItem("lastOrder", JSON.stringify(cart))
        localStorage.setItem("lastOrderTotal", getTotalAmount().toString())
        localStorage.setItem("lastOrderNotes", orderNotes)

        // Redirect to success page
        router.push(`/order/${editableTableNumber}/success?orderId=${order.id}`)
        setCart([])
        setOrderNotes("")
      } else {
        alert("訂單送出失敗，請重試。")
      }
    } catch (error) {
      console.error("Error submitting order:", error)
      alert("訂單送出失敗，請重試。")
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-blue-50 via-sky-50 to-cyan-50">
        <div className="text-center">
          <div className="w-16 h-16 blue-gradient rounded-2xl mx-auto mb-4 flex items-center justify-center animate-pulse">
            <Utensils className="h-8 w-8 text-white" />
          </div>
          <p className="text-gray-600">載入菜單中...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-sky-50 to-cyan-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-md shadow-sm border-b border-blue-100/50 sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 blue-gradient rounded-xl flex items-center justify-center">
                <Utensils className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{restaurant?.name}</h1>
                <div className="flex items-center gap-4 mt-1 text-sm text-gray-600">
                  <div className="flex items-center gap-1">
                    <MapPin className="h-3 w-3" />
                    <span>{restaurant?.address}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Phone className="h-3 w-3" />
                    <span>{restaurant?.phone}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    <span>
                      {restaurant?.businessHours.open} - {restaurant?.businessHours.close}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              {isEditingTable ? (
                <div className="flex items-center gap-2">
                  <Input
                    value={editableTableNumber}
                    onChange={(e) => setEditableTableNumber(e.target.value)}
                    className="w-20 h-8 text-center"
                    onBlur={() => setIsEditingTable(false)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        setIsEditingTable(false)
                      }
                    }}
                    autoFocus
                  />
                  <span className="text-sm text-gray-600">桌號</span>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Badge className="blue-gradient text-white px-4 py-2 text-base">桌號 {editableTableNumber}</Badge>
                  <Button variant="ghost" size="sm" onClick={() => setIsEditingTable(true)}>
                    <Edit2 className="h-4 w-4" />
                  </Button>
                </div>
              )}
              <div className="flex">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star key={star} className="h-4 w-4 fill-blue-400 text-blue-400" />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Menu */}
          <div className="lg:col-span-2">
            {/* Category Tabs */}
            <div className="flex gap-3 mb-8 overflow-x-auto pb-2">
              {menu.map((category) => (
                <Button
                  key={category.id}
                  variant={selectedCategory === category.id ? "default" : "outline"}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`whitespace-nowrap rounded-full px-6 py-2 transition-all ${
                    selectedCategory === category.id
                      ? "blue-gradient text-white shadow-lg"
                      : "bg-white/80 border-blue-200 hover:bg-blue-50"
                  }`}
                >
                  {category.name}
                </Button>
              ))}
            </div>

            {/* Menu Items */}
            <div className="space-y-6">
              {menu
                .filter((category) => selectedCategory === category.id)
                .map((category) => (
                  <div key={category.id}>
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">{category.name}</h2>
                    <div className="grid gap-6">
                      {category.items.map((item) => (
                        <Card
                          key={item.id}
                          className={`premium-card hover:scale-[1.02] transition-all duration-300 ${
                            !item.isAvailable ? "opacity-60" : ""
                          }`}
                        >
                          <CardContent className="p-6">
                            <div className="flex gap-6">
                              <div className="relative">
                                <Image
                                  src={item.image || "/placeholder.svg?height=120&width=120"}
                                  alt={item.name}
                                  width={120}
                                  height={120}
                                  className="rounded-2xl object-cover"
                                />
                                {!item.isAvailable && (
                                  <div className="absolute inset-0 bg-black/50 rounded-2xl flex items-center justify-center">
                                    <span className="text-white font-medium text-sm">已售完</span>
                                  </div>
                                )}
                              </div>
                              <div className="flex-1">
                                <div className="flex justify-between items-start mb-3">
                                  <div>
                                    <h3 className="font-bold text-xl text-gray-900 mb-2">{item.name}</h3>
                                    <p className="text-gray-600 text-sm leading-relaxed mb-3">{item.description}</p>
                                    <div className="flex items-center gap-2">
                                      <span className="text-2xl font-bold blue-gradient bg-clip-text text-transparent">
                                        NT$ {item.price}
                                      </span>
                                      <div className="flex">
                                        {[1, 2, 3, 4, 5].map((star) => (
                                          <Star key={star} className="h-3 w-3 fill-blue-400 text-blue-400" />
                                        ))}
                                      </div>
                                    </div>
                                  </div>
                                  <CustomizationModal menuItem={item} onAddToCart={addToCart} />
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                ))}
            </div>
          </div>

          {/* Cart */}
          <div className="lg:col-span-1">
            <Card className="premium-card sticky top-24">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-3 text-xl">
                  <div className="w-8 h-8 blue-gradient rounded-lg flex items-center justify-center">
                    <ShoppingCart className="h-4 w-4 text-white" />
                  </div>
                  購物車 ({cart.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                {cart.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 bg-blue-50 rounded-2xl mx-auto mb-4 flex items-center justify-center">
                      <ShoppingCart className="h-8 w-8 text-blue-400" />
                    </div>
                    <p className="text-gray-500">購物車是空的</p>
                    <p className="text-sm text-gray-400 mt-1">選擇您喜愛的餐點吧！</p>
                  </div>
                ) : (
                  <>
                    <div className="space-y-4 mb-6">
                      {cart.map((item, index) => (
                        <Card key={index} className="border border-blue-100 bg-blue-50/30">
                          <CardContent className="p-4">
                            <div className="flex justify-between items-start mb-3">
                              <div className="flex-1">
                                <h4 className="font-semibold text-gray-900">{item.menuItem.name}</h4>
                                <p className="text-sm text-gray-600">
                                  NT$ {item.menuItem.price} x {item.quantity}
                                </p>
                                {Object.keys(item.customizations).length > 0 && (
                                  <Badge variant="secondary" className="mt-1 text-xs">
                                    已客製化
                                  </Badge>
                                )}
                                {item.notes && (
                                  <p className="text-xs text-gray-600 mt-1 bg-white/50 p-2 rounded">
                                    備註: {item.notes}
                                  </p>
                                )}
                              </div>
                              <div className="flex items-center gap-2">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="w-8 h-8 p-0 rounded-full bg-transparent"
                                  onClick={() => updateCartItemQuantity(index, item.quantity - 1)}
                                >
                                  <Minus className="h-3 w-3" />
                                </Button>
                                <span className="w-8 text-center font-medium">{item.quantity}</span>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="w-8 h-8 p-0 rounded-full bg-transparent"
                                  onClick={() => updateCartItemQuantity(index, item.quantity + 1)}
                                >
                                  <Plus className="h-3 w-3" />
                                </Button>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>

                    <div className="mb-6">
                      <Label htmlFor="orderNotes" className="text-sm font-medium text-gray-700">
                        整單備註 (選填)
                      </Label>
                      <Textarea
                        id="orderNotes"
                        placeholder="請輸入特殊需求或備註..."
                        value={orderNotes}
                        onChange={(e) => setOrderNotes(e.target.value)}
                        className="mt-2 bg-white/80"
                        rows={3}
                      />
                    </div>

                    <Separator className="my-6" />
                    <div className="flex justify-between items-center mb-6">
                      <span className="text-lg font-semibold text-gray-900">總計</span>
                      <span className="text-2xl font-bold blue-gradient bg-clip-text text-transparent">
                        NT$ {getTotalAmount()}
                      </span>
                    </div>
                    <Button
                      className="w-full blue-gradient text-white hover:scale-105 transition-transform shadow-lg py-3 text-lg"
                      onClick={submitOrder}
                      disabled={cart.length === 0}
                    >
                      送出訂單
                    </Button>
                  </>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
