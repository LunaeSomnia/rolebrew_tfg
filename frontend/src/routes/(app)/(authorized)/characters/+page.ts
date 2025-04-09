import type { Character } from "$lib/bindings";
import type { PageLoad } from "./$types";

export const load: PageLoad = ({ fetch, data }) => {
    let charactersRequest = fetch(`/api/user/${data.user.username}/character`)
        .then((v) => v.json())
        .then((v) => v as Character[]);

    console.log(charactersRequest)

    return {
        charactersRequest,
    };
};
