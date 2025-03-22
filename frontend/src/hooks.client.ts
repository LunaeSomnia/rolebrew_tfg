import { browser } from '$app/environment';
import { PUBLIC_BACKEND_URL } from '$env/static/public';
import type { Handle } from '@sveltejs/kit';

export const handle: Handle = async ({ event, resolve }) => {
    if (browser) {
        console.info('refresh token')
        await fetch(PUBLIC_BACKEND_URL + '/api/auth/refresh', {
            method: 'POST',
            credentials: "include",
        })
    }

    return resolve(event);
}
