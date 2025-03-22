import { verifyToken } from '$lib/auth';
import type { Handle } from '@sveltejs/kit';
import cookie from 'cookie';
import { JWT_SECRET } from '$env/static/private'
import { userState } from '$lib/store.svelte';

export const handle: Handle = async ({ event, resolve }) => {
    const cookies = cookie.parse(event.request.headers.get('cookie') || '');
    const token = cookies.access_token;

    if (token) {
        const decoded = verifyToken(token, JWT_SECRET);

        if (decoded) {
            // @ts-ignore
            event.locals.username = decoded.sub as string;
        }
    }

    return resolve(event);
}
