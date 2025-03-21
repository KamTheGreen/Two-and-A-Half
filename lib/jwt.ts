import { SignJWT, jwtVerify } from 'jose';

const secretKey = new TextEncoder().encode(process.env.JWT_SECRET!);

if (!process.env.JWT_SECRET) {
    console.error('JWT_SECRET is missing! Ensure it is set in your .env file.');
} else {
    console.log('Loaded JWT_SECRET successfully.');
}

export async function generateToken(payload: object) {
    return new SignJWT(payload)
        .setProtectedHeader({ alg: 'HS256' })
        .setExpirationTime('7d')
        .sign(secretKey);
}

export async function verifyToken(token: string) {
    try {
        const { payload } = await jwtVerify(token, secretKey);
        return payload;
    } catch (error) {
        console.error('JWT Verification Failed:', error);
        return null;
    }
}