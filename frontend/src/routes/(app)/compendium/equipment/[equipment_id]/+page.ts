import type { Action, Feat } from "$lib/bindings";
import type { PageLoad } from "./$types";

export const load: PageLoad = async ({ params, fetch }) => {
    const data: Action = await (
        await fetch("/api/equipment/" + params.equipment_id)
    ).json();

    return {
        equipment_id: params.equipment_id,
        equipmentData: data,
    };
};
