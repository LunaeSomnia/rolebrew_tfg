import type { PageLoad } from "./$types";

export const load: PageLoad = ({ fetch }) => {

    const ancestryRequest = fetch("/api/ancestry/human").then((v) => v.json());
    return {
        ancestryRequest
    }
}