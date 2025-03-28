import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcrypt'


export async function POST(request: Request) {
    const cookieHeader = request.headers.get('cookie') || ''
    const hasSession = cookieHeader.includes('session=')

    if (hasSession) {
        return NextResponse.redirect(new URL('/dashboard', request.url))
    }

    const body = await request.json()
    const { username, password } = body

    if (!username || !password) {
        return NextResponse.json({ error: 'Brakująca nazwa użytkownika lub hasło' }, { status: 400 })
    }

    const existingUser = await prisma.user.findUnique({ where: { username } })

    if (existingUser) {
        return NextResponse.json({ error: 'Ta nazwa użytkownika już istnieje' }, { status: 409 })
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const user = await prisma.user.create({
        data: {
            username,
            password: hashedPassword,
        },
    })

    return NextResponse.json({ message: 'Utworzono użytkownika', userId: user.id })
}