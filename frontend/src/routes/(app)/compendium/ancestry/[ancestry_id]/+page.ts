import { PUBLIC_BACKEND_URL } from "$env/static/public";
import type { Ancestry } from "$lib/bindings";
import type { PageLoad } from "./$types";

export const load: PageLoad = async ({ params, fetch }) => {

    const ancestry: Ancestry = await (await fetch(PUBLIC_BACKEND_URL + '/api/ancestry/' + params.ancestry_id)).json();

    return {
        ancestry_id: params.ancestry_id,
        ancestryData: ancestry,
    }
}