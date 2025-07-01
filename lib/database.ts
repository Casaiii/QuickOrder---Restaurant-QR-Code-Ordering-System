// Mock database functions for demonstration
// In production, replace with actual database queries

import type { Restaurant, Category, MenuItem, Order, Table } from "./types"

// Mock data store
const mockData = {
  restaurants: new Map<string, Restaurant>(),
  categories: new Map<string, Category>(),
  menuItems: new Map<string, MenuItem>(),
  orders: new Map<string, Order>(),
  tables: new Map<string, Table>(),
}

// Initialize mock data
const initMockData = () => {
  // Restaurant
  const restaurant: Restaurant = {
    id: "550e8400-e29b-41d4-a716-446655440000",
    name: "美味小館",
    description: "提供道地台式料理，新鮮食材，用心烹調",
    address: "台北市大安區復興南路一段100號",
    phone: "02-2345-6789",
    isOpen: true,
    businessHours: { open: "11:00", close: "21:00" },
  }
  mockData.restaurants.set(restaurant.id, restaurant)

  // Categories
  const categories: Category[] = [
    { id: "1", name: "主餐", description: "精選主餐料理", order: 1, restaurantId: restaurant.id },
    { id: "2", name: "湯品", description: "暖心湯品", order: 2, restaurantId: restaurant.id },
    { id: "3", name: "飲料", description: "清涼飲品", order: 3, restaurantId: restaurant.id },
  ]
  categories.forEach((cat) => mockData.categories.set(cat.id, cat))

  // Menu Items
  const menuItems: MenuItem[] = [
    {
      id: "1",
      name: "滷肉飯",
      description: "香濃滷肉配白飯，經典台式美味",
      price: 80,
      categoryId: "1",
      restaurantId: restaurant.id,
      isAvailable: true,
      image: "/placeholder.svg?height=200&width=200",
    },
    {
      id: "2",
      name: "牛肉麵",
      description: "清燉牛肉湯頭，軟嫩牛肉塊",
      price: 150,
      categoryId: "1",
      restaurantId: restaurant.id,
      isAvailable: true,
      image: "/placeholder.svg?height=200&width=200",
    },
    {
      id: "3",
      name: "炒飯",
      description: "蛋炒飯配時蔬，香氣四溢",
      price: 90,
      categoryId: "1",
      restaurantId: restaurant.id,
      isAvailable: true,
      image: "/placeholder.svg?height=200&width=200",
    },
    {
      id: "4",
      name: "味噌湯",
      description: "日式味噌湯，溫暖心房",
      price: 30,
      categoryId: "2",
      restaurantId: restaurant.id,
      isAvailable: true,
      image: "/placeholder.svg?height=200&width=200",
    },
    {
      id: "5",
      name: "玉米濃湯",
      description: "香濃玉米湯，營養豐富",
      price: 40,
      categoryId: "2",
      restaurantId: restaurant.id,
      isAvailable: true,
      image: "/placeholder.svg?height=200&width=200",
    },
    {
      id: "6",
      name: "珍珠奶茶",
      description: "經典台式珍珠奶茶",
      price: 60,
      categoryId: "3",
      restaurantId: restaurant.id,
      isAvailable: true,
      image: "/placeholder.svg?height=200&width=200",
      customizations: [
        {
          id: "sweetness",
          name: "甜度",
          type: "single",
          required: true,
          options: [
            { id: "normal", name: "正常甜", price: 0 },
            { id: "less", name: "少糖", price: 0 },
            { id: "half", name: "半糖", price: 0 },
            { id: "quarter", name: "微糖", price: 0 },
            { id: "none", name: "無糖", price: 0 },
          ],
        },
        {
          id: "ice",
          name: "冰塊",
          type: "single",
          required: true,
          options: [
            { id: "normal", name: "正常冰", price: 0 },
            { id: "less", name: "少冰", price: 0 },
            { id: "none", name: "去冰", price: 0 },
            { id: "hot", name: "熱飲", price: 0 },
          ],
        },
      ],
    },
    {
      id: "7",
      name: "檸檬汁",
      description: "新鮮檸檬汁，酸甜解膩",
      price: 50,
      categoryId: "3",
      restaurantId: restaurant.id,
      isAvailable: true,
      image: "/placeholder.svg?height=200&width=200",
    },
  ]
  menuItems.forEach((item) => mockData.menuItems.set(item.id, item))

  // Tables
  const tables: Table[] = [
    { id: "1", number: "1", restaurantId: restaurant.id, qrCode: "table-1-qr", isActive: true },
    { id: "2", number: "2", restaurantId: restaurant.id, qrCode: "table-2-qr", isActive: true },
    { id: "3", number: "3", restaurantId: restaurant.id, qrCode: "table-3-qr", isActive: true },
    { id: "4", number: "4", restaurantId: restaurant.id, qrCode: "table-4-qr", isActive: true },
  ]
  tables.forEach((table) => mockData.tables.set(table.id, table))
}

// Initialize data
initMockData()

export const db = {
  restaurants: {
    findById: async (id: string): Promise<Restaurant | null> => {
      return mockData.restaurants.get(id) || null
    },
  },

  categories: {
    findByRestaurantId: async (restaurantId: string): Promise<Category[]> => {
      return Array.from(mockData.categories.values())
        .filter((cat) => cat.restaurantId === restaurantId)
        .sort((a, b) => a.order - b.order)
    },
  },

  menuItems: {
    findByCategoryId: async (categoryId: string): Promise<MenuItem[]> => {
      return Array.from(mockData.menuItems.values()).filter((item) => item.categoryId === categoryId)
    },

    findById: async (id: string): Promise<MenuItem | null> => {
      return mockData.menuItems.get(id) || null
    },

    findByRestaurantId: async (restaurantId: string): Promise<MenuItem[]> => {
      return Array.from(mockData.menuItems.values()).filter((item) => item.restaurantId === restaurantId)
    },

    update: async (id: string, updates: Partial<MenuItem>): Promise<MenuItem | null> => {
      const item = mockData.menuItems.get(id)
      if (item) {
        const updated = { ...item, ...updates }
        mockData.menuItems.set(id, updated)
        return updated
      }
      return null
    },
  },

  orders: {
    create: async (order: Omit<Order, "id" | "createdAt" | "updatedAt">): Promise<Order> => {
      const newOrder: Order = {
        ...order,
        id: Date.now().toString(),
        createdAt: new Date(),
        updatedAt: new Date(),
      }
      mockData.orders.set(newOrder.id, newOrder)
      return newOrder
    },

    findByRestaurantId: async (restaurantId: string): Promise<Order[]> => {
      return Array.from(mockData.orders.values())
        .filter((order) => order.restaurantId === restaurantId)
        .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
    },

    update: async (id: string, updates: Partial<Order>): Promise<Order | null> => {
      const order = mockData.orders.get(id)
      if (order) {
        const updated = { ...order, ...updates, updatedAt: new Date() }
        mockData.orders.set(id, updated)
        return updated
      }
      return null
    },
  },

  tables: {
    findByQrCode: async (qrCode: string): Promise<Table | null> => {
      return Array.from(mockData.tables.values()).find((table) => table.qrCode === qrCode) || null
    },

    findByRestaurantId: async (restaurantId: string): Promise<Table[]> => {
      return Array.from(mockData.tables.values())
        .filter((table) => table.restaurantId === restaurantId)
        .sort((a, b) => Number.parseInt(a.number) - Number.parseInt(b.number))
    },
  },
}
