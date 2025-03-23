import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcrypt';
import { generateToken } from '@/lib/jwt';

export async function POST(request: Request) {
    const body = await request.json();
    const { username, password } = body;

    if (!username || !password) {
        return NextResponse.json({ error: 'Wypełnij formularz' }, { status: 400 });
    }

    const user = await prisma.user.findUnique({ where: { username } });

    if (!user) {
        return NextResponse.json({ error: 'Nie znaleziono użytkownika' }, { status: 404 });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
        return NextResponse.json({ error: 'Błędne hasło' }, { status: 401 });
    }

    const token = generateToken({ userId: user.id, username: user.username });

    const response = NextResponse.json({ message: 'Zalogowano poprawnie' });

    response.cookies.set('auth-token', token, {
        httpOnly: true,
        sameSite: 'lax',
        secure: false,
        path: '/',
        maxAge: 60 * 60 * 24 * 7 // 7 days
    });

    return response;
}