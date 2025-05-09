import { authenticateUser } from "$lib/auth";
import { redirect, type Handle, type HandleFetch } from "@sveltejs/kit";

export const handle: Handle = async ({ event, resolve }) => {
    // Suppress Brave
    if (
        event.url.pathname.startsWith(
            "/.well-known/appspecific/com.chrome.devtools",
        )
    ) {
        return new Response(null, { status: 204 }); // Return empty response with 204 No Content
    }

    // @ts-ignore
    event.locals.user = await authenticateUser(event);

    const route = event.route.id ?? "";

    if (
        route.includes("(authorized)") &&
        // @ts-ignore
        !event.locals.user
    ) {
        throw redirect(
            303,
            `/login?unauthorized=true&from=${encodeURIComponent(event.url.pathname)}`,
        );
    }

    // if (
    //     // @ts-ignore
    //     event.locals.user &&
    //     (route.includes("login") || route.includes("register"))
    // ) {
    //     return new Response(null, { status: 200 });
    // }

    const response = await resolve(event);
    return response;
};
