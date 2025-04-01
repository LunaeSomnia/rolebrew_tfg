import type { Class } from "$lib/bindings";
import type { PageLoad } from "./$types";

export const load: PageLoad = async ({ params, fetch }) => {
    const classData: Class = await (
        await fetch("/api/class/" + params.class_id)
    ).json();

    return {
        class_id: params.class_id,
        classData,
    };
};
