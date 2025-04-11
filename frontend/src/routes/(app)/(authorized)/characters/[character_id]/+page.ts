import type { Character } from "$lib/bindings";
import type { PageLoad } from "./$types";

export const load: PageLoad = async ({ fetch, data, params }) => {
    let character = await fetch(`/api/user/${data.user.username}/character/${params.character_id}`)
        .then((v) => v.json())
        .then((v) => v as Character);

    return {
        character,
    };
};
