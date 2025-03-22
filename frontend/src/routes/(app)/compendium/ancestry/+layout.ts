import { PUBLIC_BACKEND_URL } from "$env/static/public";
import type { Summary } from "$lib/bindings";
import type { LayoutLoad } from "./$types";

export const load: LayoutLoad = async ({ parent }) => {
    const parentData = await parent();

    let tableData: Summary[] = []
    switch (parentData.compendiumSection) {
        case "ancestry":
            tableData = await (await fetch(PUBLIC_BACKEND_URL + '/api/ancestry/summary')).json()
            break;
    }

    return {
        tableSummaryData: tableData,
    }
}