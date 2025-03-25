import { PUBLIC_BACKEND_URL } from "$env/static/public";
import type { Action, Feat } from "$lib/bindings";
import type { PageLoad } from "./$types";

export const load: PageLoad = async ({ params, fetch }) => {

    const feat: Action = await (await fetch(PUBLIC_BACKEND_URL + '/api/action/' + params.action_id)).json();

    return {
        action_id: params.action_id,
        actionData: feat,
    }
}