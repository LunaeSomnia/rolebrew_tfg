import type { Condition } from "$lib/bindings";
import type { PageLoad } from "./$types";

export const load: PageLoad = async ({ params, fetch }) => {
    const conditionData: Condition = await (
        await fetch("/api/condition/" + params.condition_id)
    ).json();

    return {
        condition_id: params.condition_id,
        conditionData,
    };
};
