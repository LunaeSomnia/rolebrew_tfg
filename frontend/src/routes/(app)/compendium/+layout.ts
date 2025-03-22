import type { LayoutLoad } from "./$types";

export const load: LayoutLoad = async ({ route, url }) => {
    const routeId = url.pathname.replace('/compendium/', "");

    const routeSplit = routeId.split('/')

    const compendiumSection = routeSplit[0]
    const compendiumPage = routeSplit[1] ?? null

    return {
        compendiumSection,
        compendiumPage
    }
}