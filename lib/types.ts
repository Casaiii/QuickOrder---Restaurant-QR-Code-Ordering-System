export interface Restaurant {
  id: string
  name: string
  description: string
  address: string
  phone: string
  isOpen: boolean
  businessHours: {
    open: string
    close: string
  }
}

export interface Category {
  id: string
  name: string
  description?: string
  order: number
  restaurantId: string
}

export interface MenuItem {
  id: string
  name: string
  description: string
  price: number
  image?: string
  categoryId: string
  restaurantId: string
  isAvailable: boolean
  customizations?: Customization[]
}

export interface Customization {
  id: string
  name: string
  type: "single" | "multiple"
  required: boolean
  options: CustomizationOption[]
}

export interface CustomizationOption {
  id: string
  name: string
  price: number
}

export interface CartItem {
  menuItem: MenuItem
  quantity: number
  customizations: { [key: string]: string[] }
  notes?: string
}

export interface Order {
  id: string
  restaurantId: string
  tableNumber: string
  items: CartItem[]
  totalAmount: number
  status: "pending" | "confirmed" | "preparing" | "ready" | "completed" | "cancelled"
  paymentStatus: "pending" | "paid" | "failed"
  paymentMethod?: string
  customerNotes?: string
  tableNotes?: string
  createdAt: Date
  updatedAt: Date
}

export interface Table {
  id: string
  number: string
  restaurantId: string
  qrCode: string
  isActive: boolean
}
