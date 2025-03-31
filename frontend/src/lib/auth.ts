import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import type { RequestEvent } from "@sveltejs/kit";
import { JWT_SECRET } from "$env/static/private";
import type { UserState } from "./store.svelte";
import type { UserClaims } from "./bindings";

export async function authenticateUser(event: RequestEvent) {
    const cookies = event.cookies;

    const token = cookies.get("token");
    const tokenDecoded = verifyToken(
        token ?? "",
        JWT_SECRET,
    ) as UserClaims | null;

    if (token && tokenDecoded) {
        // access token exists, we are logged in
        return {
            username: tokenDecoded.sub,
        } as UserState;
    }

    // no refresh token, we need to re-login
    return null;
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
