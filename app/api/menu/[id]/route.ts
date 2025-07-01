import { type NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/database"

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await request.json()
    const { isAvailable } = body

    const menuItem = await db.menuItems.update(params.id, {
      isAvailable,
    })

    if (!menuItem) {
      return NextResponse.json({ error: "Menu item not found" }, { status: 404 })
    }

    return NextResponse.json(menuItem)
  } catch (error) {
    console.error("Error updating menu item:", error)
    return NextResponse.json({ error: "Failed to update menu item" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { db: mockDb } = await import("@/lib/database")

    if (mockDb.menuItems.has(params.id)) {
      mockDb.menuItems.delete(params.id)
      return NextResponse.json({ success: true })
    } else {
      return NextResponse.json({ error: "Menu item not found" }, { status: 404 })
    }
  } catch (error) {
    console.error("Error deleting menu item:", error)
    return NextResponse.json({ error: "Failed to delete menu item" }, { status: 500 })
  }
}
