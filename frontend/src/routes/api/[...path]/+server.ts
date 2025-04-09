import { PUBLIC_BACKEND_URL } from "$env/static/public";
import type { RequestHandler } from "./$types";

export const GET: RequestHandler = ({ params, url, fetch, request }) => {
    return fetch(PUBLIC_BACKEND_URL + params.path + url.search, request);
};

export const POST: RequestHandler = ({ params, url, fetch, request }) => {
    return fetch(PUBLIC_BACKEND_URL + params.path + url.search, request);
};
