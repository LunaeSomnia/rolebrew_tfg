import { PUBLIC_BACKEND_URL } from "$env/static/public";
import type { RequestHandler } from "./$types";

export const GET: RequestHandler = async ({ params, url, fetch, request }) => {
    request.headers.append('Accept-Encoding', 'identity')
    const fetchResult = await fetch(PUBLIC_BACKEND_URL + params.path + url.search, request)

    const data = await fetchResult.json();
    return new Response(JSON.stringify(data), {
        headers: { 'Content-Type': 'application/json' }
    });
};

export const POST: RequestHandler = async ({ params, url, fetch, request }) => {
    request.headers.append('Accept-Encoding', 'identity')
    const fetchResult = await fetch(PUBLIC_BACKEND_URL + params.path + url.search, request)

    const data = await fetchResult.json();
    return new Response(JSON.stringify(data), {
        headers: { 'Content-Type': 'application/json' }
    });
};
