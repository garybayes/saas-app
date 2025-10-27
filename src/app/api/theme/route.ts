import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function POST(req: Request) {
  const { theme } = await req.json()

  if (!theme || !['light', 'dark'].includes(theme)) {
    return NextResponse.json({ error: 'Invalid theme' }, { status: 400 })
  }

  // Example: updating a single user (ID 1)
  try {
    await prisma.user.update({
      where: { id: 1 },
      data: { theme },
    })
    return NextResponse.json({ success: true, theme })
  } catch (error) {
    console.error('Error updating theme:', error)
    return NextResponse.json({ error: 'Database error' }, { status: 500 })
  }
}
