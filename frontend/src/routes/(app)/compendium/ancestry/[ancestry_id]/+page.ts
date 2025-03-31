import { PUBLIC_BACKEND_URL } from "$env/static/public";
import type { Ancestry, Summary } from "$lib/bindings";
import type { PageLoad } from "./$types";

export const load: PageLoad = async ({ params, fetch }) => {

    const ancestryRequest: Promise<Ancestry> = fetch(PUBLIC_BACKEND_URL + '/api/ancestry/' + params.ancestry_id).then(v => v.json());


    const ancestryFeatsRequestParams = new URLSearchParams();
    ancestryFeatsRequestParams.append("has_traits", params.ancestry_id);
    const ancestryFeatsRequest: Promise<Summary[]> = fetch(PUBLIC_BACKEND_URL + "/api/feat/summary?" + ancestryFeatsRequestParams.toString(),).then(v => v.json())

    return {
        ancestry_id: params.ancestry_id,
        ancestryRequest,
        ancestryFeatsRequest
    }
}