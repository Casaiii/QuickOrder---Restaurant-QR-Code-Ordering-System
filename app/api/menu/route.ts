import { type NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/database"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const restaurantId = searchParams.get("restaurantId")

    if (!restaurantId) {
      return NextResponse.json({ error: "Restaurant ID is required" }, { status: 400 })
    }

    const [categories, menuItems] = await Promise.all([
      db.categories.findByRestaurantId(restaurantId),
      db.menuItems.findByRestaurantId(restaurantId),
    ])

    const menuWithItems = categories.map((category) => ({
      ...category,
      items: menuItems.filter((item) => item.categoryId === category.id),
    }))

    return NextResponse.json(menuWithItems)
  } catch (error) {
    console.error("Error fetching menu:", error)
    return NextResponse.json({ error: "Failed to fetch menu" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, description, price, categoryId, restaurantId, isAvailable } = body

    if (!name || !price || !categoryId || !restaurantId) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // In a real app, you'd create the menu item in the database
    const newMenuItem = {
      id: Date.now().toString(),
      name,
      description: description || "",
      price: Number.parseFloat(price),
      categoryId,
      restaurantId,
      isAvailable: isAvailable !== false,
      image: "/placeholder.svg?height=200&width=200",
    }

    // Mock database update
    const { db: mockDb } = await import("@/lib/database")
    mockDb.menuItems.set(newMenuItem.id, newMenuItem as any)

    return NextResponse.json(newMenuItem)
  } catch (error) {
    console.error("Error creating menu item:", error)
    return NextResponse.json({ error: "Failed to create menu item" }, { status: 500 })
  }
}
