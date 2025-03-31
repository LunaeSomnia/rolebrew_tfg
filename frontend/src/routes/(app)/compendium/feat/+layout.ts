import { PUBLIC_BACKEND_URL } from "$env/static/public";
import type { Summary } from "$lib/bindings";
import type { LayoutLoad } from "./$types";

export const load: LayoutLoad = async ({ parent, fetch }) => {
    const parentData = await parent();

    let tableData: Summary[] = []
    switch (parentData.compendiumSection) {
        case "feat":
            tableData = await (await fetch(PUBLIC_BACKEND_URL + '/api/feat/summary')).json()
            break;
    }

    return {
        tableSummaryData: tableData,
    }
}