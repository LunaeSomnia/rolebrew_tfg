import type { UserState } from "$lib/store.svelte";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = ({ locals }) => {
    return {
        // @ts-ignore
        user: locals.user as UserState,
    };
};
