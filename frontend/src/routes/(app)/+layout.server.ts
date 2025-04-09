import type { UserState } from "$lib/store.svelte";
import type { LayoutServerLoad } from "./$types";

export const load: LayoutServerLoad = ({ locals }) => {
    return {
        //@ts-ignore
        user: locals.user as UserState,
    };
};
