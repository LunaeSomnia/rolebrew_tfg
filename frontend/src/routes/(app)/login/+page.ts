import type { PageLoad } from "./$types";

export const load: PageLoad = ({ url }) => {
    const queryParams = url.searchParams;
    return {
        queryParams: queryParams,
    };
};
