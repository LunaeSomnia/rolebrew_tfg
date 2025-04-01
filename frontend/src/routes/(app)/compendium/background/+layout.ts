import type { Summary } from "$lib/bindings";
import type { LayoutLoad } from "./$types";

export const load: LayoutLoad = async ({ parent, fetch }) => {
    const parentData = await parent();

    let tableData: Summary[] = [];
    switch (parentData.compendiumSection) {
        case "background":
            tableData = await (await fetch("/api/background/summary")).json();
            break;
    }

    return {
        tableSummaryData: tableData,
    };
};
