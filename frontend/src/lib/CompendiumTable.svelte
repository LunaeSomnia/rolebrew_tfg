<script lang="ts">
    import type { Summary } from "./bindings";
    import Searchbox from "./components/Searchbox.svelte";
    import { CompendiumSection, TableSorting } from "./compendiumTableDef";
    import SortedTable from "./components/SortedTable.svelte";

    let {
        tableData,
        compendiumSection,
        selectedRowSlug,
    }: {
        compendiumSection: CompendiumSection;
        tableData: Summary[];
        selectedRowSlug: string;
    } = $props();

    let compendiumSectionHeader = $derived(compendiumSection.toString());
    let searchboxValue = $state("");
    let filteredTableData = $derived(filterTableData(tableData));

    export function filterTableData(tableData: Summary[]): Summary[] {
        let filtered = tableData;
        if (searchboxValue !== "") {
            filtered = filtered.filter(
                (v) => v.name.toLowerCase().indexOf(searchboxValue) != -1,
            );
        }

        return filtered;
    }
</script>

<div class="compendium-table column">
    <div class="header row spaced-between">
        <h1>{compendiumSectionHeader}</h1>
        <div class="row table-controls">
            <Searchbox bind:value={searchboxValue} />
        </div>
    </div>
    <SortedTable
        tableData={filteredTableData}
        {compendiumSection}
        {selectedRowSlug}
    />
</div>

<style lang="scss">
    .compendium-table {
        flex: 1;
        max-height: 50rem;
        gap: 2rem;
    }

    .header {
        width: 100%;
        align-items: flex-end;

        h1 {
            line-height: 3rem;
            text-transform: capitalize;
        }
    }
</style>
