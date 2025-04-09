import type { LayoutLoad } from "./$types";

export const load: LayoutLoad = async ({ route, data }) => {
    const routeId = route.id?.replaceAll("/(app)/", "");
    const basePathSplit = routeId?.split("/");
    const basePath = basePathSplit !== undefined ? basePathSplit[0] : routeId;

    return {
        basePath,
        route,
    };
};
