import { userState } from "$lib/store.svelte";
import { redirect } from "@sveltejs/kit";
import type { LayoutServerLoad } from "./$types";

export const load: LayoutServerLoad = async ({ locals }) => {

    // @ts-ignore
    const username = locals.username

    userState.username = username;

    if (!userState.username) {
        redirect(308, "/login")
    }
}