import { PUBLIC_BACKEND_URL } from "$env/static/public";

export async function fetchFromBackend(url: string) {
    return await fetch(url, {
        headers: {
            'Access-Control-Allow-Origin': "*"
        }
    })
}