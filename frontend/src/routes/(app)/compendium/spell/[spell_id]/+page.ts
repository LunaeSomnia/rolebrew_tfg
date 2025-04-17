import type { Background } from "$lib/bindings";
import type { PageLoad } from "./$types";

export const load: PageLoad = async ({ params, fetch }) => {
    const spellData: Background = await (
        await fetch("/api/spell/" + params.spell_id)
    ).json();

    return {
        spell_id: params.spell_id,
        spellData,
    };
};
