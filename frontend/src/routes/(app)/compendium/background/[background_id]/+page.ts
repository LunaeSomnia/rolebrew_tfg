import type { Background } from "$lib/bindings";
import type { PageLoad } from "./$types";

export const load: PageLoad = async ({ params, fetch }) => {
    const backgroundData: Background = await (
        await fetch("/api/background/" + params.background_id)
    ).json();

    return {
        background_id: params.background_id,
        backgroundData,
    };
};
