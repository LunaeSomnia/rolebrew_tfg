import { authenticateUser } from "$lib/auth";
import { redirect, type Handle, type HandleFetch } from "@sveltejs/kit";
import cookie from "cookie";
import { JWT_SECRET } from "$env/static/private";

export const handle: Handle = async ({ event, resolve }) => {
    const authentication = await authenticateUser(event);
    // @ts-ignore
    event.locals.user = authentication;

    if (
        event.route.id &&
        event.route.id.includes("(authorized)") &&
        // @ts-ignore
        !event.locals.user
    ) {
        throw redirect(303, "/login?unauthorized=true");
    }

    return resolve(event);
};

// export const handle: Handle = async ({ event, resolve }) => {
//     const cookies = cookie.parse(event.request.headers.get("cookie") || "");
//     const token = cookies.access_token;

//     if (token) {
//         const decoded = verifyToken(token, JWT_SECRET);
//         if (decoded) {
//             const instant = Math.floor(Date.now() / 1000);
//             // @ts-ignore
//             event.locals.username = decoded.sub as string;
//         } else {
//             // token expired
//         }
//     }

//     return resolve(event);
// };

// hooks.server.ts
// export const { handle: getAuthConfig } = SvelteKitAuth(async (event) => {
//     const config: SvelteKitAuthConfig = {
//         ....,
//         callbacks: {
//             async jwt({ token, account, profile }) {
//                 /**
//                  * This callback triggers multiple times. For the very first time,
//                  * token -> { name, email, picture, sub }
//                  * account -> { all_tokens }
//                  * profile -> { all_user_details_and_custom-attributes }
//                  * trigger -> { signin, signut, update }
//                  * For second and successive times,
//                  * token -> { name, email, picture, sub, iat, exp, jti }
//                  * account -> undefined
//                  * profile -> undefined
//                  * trigger -> undefined
//                 */
//                 // store init values that must be passed to session cb, if this line is skipped then
//                 // { name, email, picture, sub, iat, exp, jti } will always be undefined in session cb
//                 try {
//                     if (!isEmpty(account)) {
//                         token = { ...token, ...account };
//                     }
//                     if (!isEmpty(profile)) {
//                         token = { ...token, ...(profile as any) };
//                     }

//                     // update user data on request
//                     const userQuery = event.request.headers.get('query') || event.url.searchParams.get('query');

//                     // refresh token post 30 minutes
//                     if (
//                         token &&
//                         (isTokenRefreshRequired(token.token_expires_in as string) || userQuery === 'update-token-data')
//                     ) {
//                         const tokenRequest = await event.fetch(
//                             event.url.origin + '/api/renew-token',
//                             { method: 'POST' }
//                         );
//                         const updatedToken = await tokenRequest.json();
//                         if (updatedToken.access_token) {
//                             token = {
//                                 ...token,
//                                 ...updatedToken
//                             };
//                         }
//                     }
//                 } catch (e: any) {
//                     console.log('ERROR in AUTH JWT CALLBACK: ', e?.message);
//                 }
//                 return token;
//             },
//             async session({ session, token }) {
//                 try {
//                     // This callback triggers multiple times
//                     if (session.user) {
//                         if (token?.access_token) {
//                             session.user = { ...session.user, ...token } as any;
//                         }
//                     }
//                 } catch (e: any) {
//                     console.log('ERROR in AUTH SESSION CALLBACK: ', e?.message);
//                 }
//                 return session;
//             }
//         },
//     }
// });

// function isTokenRefreshRequired(issued_at: string) {
//     return +difference([new Date(+issued_at), new Date(), 'minutes']) > 29;
// }
