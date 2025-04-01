import type { Summary } from "$lib/bindings";
import type { LayoutLoad } from "./$types";

export const load: LayoutLoad = async ({ parent, fetch }) => {
    const parentData = await parent();

    let tableData: Summary[] = [];
    switch (parentData.compendiumSection) {
        case "class":
            tableData = await (await fetch("/api/class/summary")).json();
            break;
    }

    return {
        tableSummaryData: tableData,
    };
};
