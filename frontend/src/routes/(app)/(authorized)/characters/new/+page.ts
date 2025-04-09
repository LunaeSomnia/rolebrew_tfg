import type { Summary } from "$lib/bindings";
import type { PageLoad } from "./$types";

export const load: PageLoad = async ({ fetch }) => {
    const ancestrySummaries: Summary[] = await fetch("/api/ancestry/summary").then((v) => v.json())
    const backgroundSummaries: Summary[] = await fetch("/api/background/summary").then((v) => v.json())
    const classSummaries: Summary[] = await fetch("/api/class/summary").then((v) => v.json())

    return {
        ancestrySummaries,
        backgroundSummaries,
        classSummaries
    }
}