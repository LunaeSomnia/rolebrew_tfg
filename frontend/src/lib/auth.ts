import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { dev } from '$app/environment';

const JWT_SECRET = 'your_secret_key'; // Use env vars in production
const REFRESH_SECRET = 'your_refresh_secret';
const ACCESS_EXPIRES_IN = '15m';
const REFRESH_EXPIRES_IN = '7d';

export function generateTokens(userId: string) {
    const accessToken = jwt.sign({ userId }, JWT_SECRET, { expiresIn: ACCESS_EXPIRES_IN });
    const refreshToken = jwt.sign({ userId }, REFRESH_SECRET, { expiresIn: REFRESH_EXPIRES_IN });

    return { accessToken, refreshToken };
}

export async function hashPassword(password: string) {
    return await bcrypt.hash(password, 10);
}

export async function verifyPassword(password: string, hash: string) {
    return await bcrypt.compare(password, hash);
}

export function verifyToken(token: string, secret: string) {
    try {
        return jwt.verify(token, secret);
    } catch {
        return null;
    }
}
