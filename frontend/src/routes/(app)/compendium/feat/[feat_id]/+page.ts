import type { Feat } from "$lib/bindings";
import type { PageLoad } from "./$types";

export const load: PageLoad = async ({ params, fetch }) => {
    const feat: Feat = await (
        await fetch("/api/feat/" + params.feat_id)
    ).json();

    return {
        feat_id: params.feat_id,
        featData: feat,
    };
};
