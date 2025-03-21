import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/jwt';
console.log('🚀 Middleware file loaded by Next.js');
export function middleware(req: NextRequest) {
    console.log('Middleware executing...');

    const token = req.cookies.get('auth-token')?.value;
    console.log('Token from cookies:', token);

    if (req.nextUrl.pathname === '/login' || req.nextUrl.pathname === '/register') {
        console.log('Accessing login or register, allowing...');
        return NextResponse.next();
    }

    if (!token) {
        console.log('No token found, redirecting to /login...');
        return NextResponse.redirect(new URL('/login', req.url));
    }

    try {
        const user = verifyToken(token);
        console.log('Decoded user:', user);

        if (!user) {
            console.log('Invalid token, redirecting to /login...');
            return NextResponse.redirect(new URL('/login', req.url));
        }

        console.log('Token valid, allowing access to:', req.nextUrl.pathname);
        return NextResponse.next();

    } catch (error) {
        console.error('JWT Verification Failed:', error);
        return NextResponse.redirect(new URL('/login', req.url));
    }
}

export const config = {
    matcher: ['/dashboard/:path*'],
};