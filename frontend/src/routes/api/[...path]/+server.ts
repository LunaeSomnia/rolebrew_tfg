import { PUBLIC_BACKEND_URL } from "$env/static/public";
import type { RequestHandler } from "./$types";

export const GET: RequestHandler = ({ params, url }) => {
    return fetch(PUBLIC_BACKEND_URL + params.path + url.search);
};

export const POST: RequestHandler = ({ params, url }) => {
    return fetch(PUBLIC_BACKEND_URL + params.path + url.search);
};
