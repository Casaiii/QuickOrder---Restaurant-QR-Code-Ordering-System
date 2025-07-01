"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Star } from "lucide-react"
import type { MenuItem } from "@/lib/types"

interface CustomizationModalProps {
  menuItem: MenuItem
  onAddToCart: (item: MenuItem, customizations: { [key: string]: string[] }, notes?: string) => void
}

export default function CustomizationModal({ menuItem, onAddToCart }: CustomizationModalProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedCustomizations, setSelectedCustomizations] = useState<{ [key: string]: string[] }>({})
  const [notes, setNotes] = useState("")

  const handleCustomizationChange = (customizationId: string, optionId: string, type: "single" | "multiple") => {
    if (type === "single") {
      setSelectedCustomizations({
        ...selectedCustomizations,
        [customizationId]: [optionId],
      })
    } else {
      const current = selectedCustomizations[customizationId] || []
      const updated = current.includes(optionId) ? current.filter((id) => id !== optionId) : [...current, optionId]
      setSelectedCustomizations({
        ...selectedCustomizations,
        [customizationId]: updated,
      })
    }
  }

  const handleAddToCart = () => {
    onAddToCart(menuItem, selectedCustomizations, notes)
    setIsOpen(false)
    setSelectedCustomizations({})
    setNotes("")
  }

  const calculateTotalPrice = () => {
    let total = menuItem.price
    if (menuItem.customizations) {
      for (const customization of menuItem.customizations) {
        const selectedOptions = selectedCustomizations[customization.id] || []
        for (const optionId of selectedOptions) {
          const option = customization.options.find((opt) => opt.id === optionId)
          if (option) {
            total += option.price
          }
        }
      }
    }
    return total
  }

  const canAddToCart = () => {
    if (!menuItem.customizations) return true

    for (const customization of menuItem.customizations) {
      if (customization.required) {
        const selected = selectedCustomizations[customization.id]
        if (!selected || selected.length === 0) {
          return false
        }
      }
    }
    return true
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          className="earth-button text-white hover:earth-button rounded-2xl px-6 shadow-lg"
          disabled={!menuItem.isAvailable}
        >
          {menuItem.isAvailable ? "I Want This" : "已售完"}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto sage-bg rounded-3xl">
        <DialogHeader className="pb-4">
          <DialogTitle className="text-2xl font-bold text-gray-800 flex items-center gap-3">
            {menuItem.name}
            <div className="flex">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star key={star} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              ))}
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <Card className="premium-card rounded-3xl">
            <CardContent className="p-4">
              <p className="text-gray-600 mb-3 leading-relaxed">{menuItem.description}</p>
              <div className="flex items-center justify-between">
                <span className="text-lg font-semibold text-gray-700">基本價格</span>
                <span className="text-xl font-bold text-gray-800">NT$ {menuItem.price}</span>
              </div>
            </CardContent>
          </Card>

          {menuItem.customizations &&
            menuItem.customizations.map((customization) => (
              <Card key={customization.id} className="premium-card rounded-3xl">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2 text-gray-800">
                    {customization.name}
                    {customization.required && (
                      <Badge className="earth-gradient text-white text-xs rounded-full">必選</Badge>
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  {customization.type === "single" ? (
                    <RadioGroup
                      value={selectedCustomizations[customization.id]?.[0] || ""}
                      onValueChange={(value) => handleCustomizationChange(customization.id, value, "single")}
                    >
                      {customization.options.map((option) => (
                        <div
                          key={option.id}
                          className="flex items-center space-x-3 p-3 rounded-2xl hover:bg-sage-primary/30 transition-colors"
                        >
                          <RadioGroupItem value={option.id} id={option.id} />
                          <Label
                            htmlFor={option.id}
                            className="flex-1 cursor-pointer flex justify-between items-center"
                          >
                            <span className="font-medium text-gray-800">{option.name}</span>
                            {option.price > 0 && (
                              <span className="text-gray-700 font-semibold">+NT$ {option.price}</span>
                            )}
                          </Label>
                        </div>
                      ))}
                    </RadioGroup>
                  ) : (
                    <div className="space-y-3">
                      {customization.options.map((option) => (
                        <div
                          key={option.id}
                          className="flex items-center space-x-3 p-3 rounded-2xl hover:bg-sage-primary/30 transition-colors"
                        >
                          <Checkbox
                            id={option.id}
                            checked={selectedCustomizations[customization.id]?.includes(option.id) || false}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                handleCustomizationChange(customization.id, option.id, "multiple")
                              } else {
                                const current = selectedCustomizations[customization.id] || []
                                setSelectedCustomizations({
                                  ...selectedCustomizations,
                                  [customization.id]: current.filter((id) => id !== option.id),
                                })
                              }
                            }}
                          />
                          <Label
                            htmlFor={option.id}
                            className="flex-1 cursor-pointer flex justify-between items-center"
                          >
                            <span className="font-medium text-gray-800">{option.name}</span>
                            {option.price > 0 && (
                              <span className="text-gray-700 font-semibold">+NT$ {option.price}</span>
                            )}
                          </Label>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}

          <Card className="premium-card rounded-3xl">
            <CardContent className="p-4">
              <Label htmlFor="notes" className="text-sm font-semibold text-gray-700 mb-2 block">
                特殊需求備註 (選填)
              </Label>
              <Textarea
                id="notes"
                placeholder="例如：不要香菜、辣度調整、特殊要求等..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="bg-white/80 rounded-2xl"
                rows={3}
              />
            </CardContent>
          </Card>

          <Card className="premium-card border-sage-accent rounded-3xl">
            <CardContent className="p-6">
              <div className="flex justify-between items-center mb-4">
                <span className="text-lg font-semibold text-gray-800">總價格</span>
                <span className="text-2xl font-bold text-gray-800">NT$ {calculateTotalPrice()}</span>
              </div>
              <Button
                className="w-full earth-button text-white rounded-2xl shadow-lg py-3 text-lg"
                onClick={handleAddToCart}
                disabled={!canAddToCart()}
              >
                I Want This
              </Button>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  )
}
