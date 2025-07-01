"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Plus, Edit2, Trash2, Eye, EyeOff, ShoppingBag } from "lucide-react"
import type { MenuItem, Category } from "@/lib/types"

interface MenuManagementProps {
  menuItems: MenuItem[]
  categories: Category[]
  onRefresh: () => void
}

interface MenuItemForm {
  id?: string
  name: string
  description: string
  price: number
  categoryId: string
  isAvailable: boolean
}

export default function MenuManagement({ menuItems, categories, onRefresh }: MenuManagementProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null)
  const [formData, setFormData] = useState<MenuItemForm>({
    name: "",
    description: "",
    price: 0,
    categoryId: "",
    isAvailable: true,
  })

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      price: 0,
      categoryId: "",
      isAvailable: true,
    })
    setEditingItem(null)
  }

  const openCreateDialog = () => {
    resetForm()
    setIsDialogOpen(true)
  }

  const openEditDialog = (item: MenuItem) => {
    setEditingItem(item)
    setFormData({
      id: item.id,
      name: item.name,
      description: item.description,
      price: item.price,
      categoryId: item.categoryId,
      isAvailable: item.isAvailable,
    })
    setIsDialogOpen(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const url = editingItem ? `/api/menu/${editingItem.id}` : "/api/menu"
      const method = editingItem ? "PATCH" : "POST"

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          restaurantId: "550e8400-e29b-41d4-a716-446655440000",
        }),
      })

      if (response.ok) {
        setIsDialogOpen(false)
        resetForm()
        onRefresh()
      } else {
        alert("操作失敗，請重試")
      }
    } catch (error) {
      console.error("Error saving menu item:", error)
      alert("操作失敗，請重試")
    }
  }

  const handleDelete = async (itemId: string) => {
    try {
      const response = await fetch(`/api/menu/${itemId}`, {
        method: "DELETE",
      })

      if (response.ok) {
        onRefresh()
      } else {
        alert("刪除失敗，請重試")
      }
    } catch (error) {
      console.error("Error deleting menu item:", error)
      alert("刪除失敗，請重試")
    }
  }

  const toggleAvailability = async (itemId: string, isAvailable: boolean) => {
    try {
      const response = await fetch(`/api/menu/${itemId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ isAvailable }),
      })

      if (response.ok) {
        onRefresh()
      }
    } catch (error) {
      console.error("Error updating menu item:", error)
    }
  }

  const getCategoryName = (categoryId: string) => {
    const category = categories.find((cat) => cat.id === categoryId)
    return category?.name || "未分類"
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">菜單管理</h3>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={openCreateDialog}>
              <Plus className="h-4 w-4 mr-2" />
              新增餐點
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>{editingItem ? "編輯餐點" : "新增餐點"}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="name">餐點名稱 *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>

              <div>
                <Label htmlFor="description">餐點描述</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                />
              </div>

              <div>
                <Label htmlFor="price">價格 (NT$) *</Label>
                <Input
                  id="price"
                  type="number"
                  min="0"
                  step="1"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: Number.parseFloat(e.target.value) || 0 })}
                  required
                />
              </div>

              <div>
                <Label htmlFor="category">分類 *</Label>
                <Select
                  value={formData.categoryId}
                  onValueChange={(value) => setFormData({ ...formData, categoryId: value })}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="選擇分類" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="isAvailable"
                  checked={formData.isAvailable}
                  onChange={(e) => setFormData({ ...formData, isAvailable: e.target.checked })}
                />
                <Label htmlFor="isAvailable">立即供應</Label>
              </div>

              <div className="flex gap-2 pt-4">
                <Button type="submit" className="flex-1">
                  {editingItem ? "更新" : "新增"}
                </Button>
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)} className="flex-1">
                  取消
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Menu Items List */}
      <div className="space-y-4">
        {categories.map((category) => {
          const categoryItems = menuItems.filter((item) => item.categoryId === category.id)

          if (categoryItems.length === 0) return null

          return (
            <Card key={category.id}>
              <CardHeader>
                <CardTitle className="text-base">{category.name}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {categoryItems.map((item) => (
                  <Card key={item.id} className="border">
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start">
                        <div className="flex items-start gap-4 flex-1">
                          <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center">
                            <ShoppingBag className="h-6 w-6 text-gray-400" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className="font-semibold">{item.name}</h4>
                              <Badge variant={item.isAvailable ? "default" : "secondary"}>
                                {item.isAvailable ? "供應中" : "已售完"}
                              </Badge>
                            </div>
                            <p className="text-sm text-gray-600 mb-2">{item.description}</p>
                            <p className="font-bold text-orange-600">NT$ {item.price}</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => toggleAvailability(item.id, !item.isAvailable)}
                          >
                            {item.isAvailable ? (
                              <>
                                <EyeOff className="h-4 w-4 mr-1" />
                                停售
                              </>
                            ) : (
                              <>
                                <Eye className="h-4 w-4 mr-1" />
                                供應
                              </>
                            )}
                          </Button>

                          <Button size="sm" variant="outline" onClick={() => openEditDialog(item)}>
                            <Edit2 className="h-4 w-4 mr-1" />
                            編輯
                          </Button>

                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button size="sm" variant="destructive">
                                <Trash2 className="h-4 w-4 mr-1" />
                                刪除
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>確認刪除</AlertDialogTitle>
                                <AlertDialogDescription>
                                  您確定要刪除「{item.name}」嗎？此操作無法復原。
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>取消</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => handleDelete(item.id)}
                                  className="bg-red-600 hover:bg-red-700"
                                >
                                  刪除
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
