import { PUBLIC_BACKEND_URL } from "$env/static/public";
import type { Summary } from "$lib/bindings";
import type { LayoutLoad } from "./$types";

export const load: LayoutLoad = async ({ parent, fetch }) => {
    const parentData = await parent();

    let tableData: Summary[] = []
    console.log(parentData.compendiumSection)
    switch (parentData.compendiumSection) {
        case "action":
            tableData = await (await fetch(PUBLIC_BACKEND_URL + '/api/action/summary')).json()
            break;
    }

    return {
        tableSummaryData: tableData,
    }
}