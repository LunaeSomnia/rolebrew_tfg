<script lang="ts">
    import type { Summary, SummaryData } from "./bindings";
    import { COLOR_CATEGORIES } from "./color_category";
    import Table from "./components/table/Table.svelte";
    import TableBody from "./components/table/TableBody.svelte";
    import TableCell from "./components/table/TableCell.svelte";
    import TableHead from "./components/table/TableHead.svelte";
    import TableHeader from "./components/table/TableHeader.svelte";
    import TableRow from "./components/table/TableRow.svelte";
    import Tag from "./components/Tag.svelte";
    import Searchbox from "./components/Searchbox.svelte";
    import { TableSorting, type TableHeaderDef } from "./compendiumTableDef";
    import { Accordion } from "bits-ui";
    import { abbreviateSource } from "./textProcessing";

    let {
        tableHeaders,
        tableData,
        compendiumRoute,
        selectedRowSlug,
    }: {
        tableHeaders?: TableHeaderDef[];
        tableData: Summary[];
        compendiumRoute: string;
        selectedRowSlug: string;
    } = $props();

    let tableHeaderState = $state(tableHeaders);
    let tableSorting: TableSorting[] = $state(
        (() => {
            const array = new Array(tableHeaders?.length).fill(
                TableSorting.None,
            );
            array[0] = TableSorting.Descending;
            return array;
        })(),
    );
    let searchboxValue = $state("");

    export function getTableData(): Summary[] {
        let filteredTableData: Summary[] = tableData;
        if (searchboxValue !== "") {
            filteredTableData = filteredTableData.filter(
                (v) => v.name.toLowerCase().indexOf(searchboxValue) != -1,
            );
        }

        if (!tableHeaderState) {
            return filteredTableData;
        }

        let sortHeaderIdx = tableSorting?.findIndex(
            (v) => v !== TableSorting.None,
        );
        const sortHeader = tableSorting[sortHeaderIdx];

        if (filteredTableData.length == 0) {
            return filteredTableData;
        }

        filteredTableData = filteredTableData.sort((a, b) => {
            let aData = a.data[sortHeaderIdx];
            let bData = b.data[sortHeaderIdx];

            if (sortHeader === TableSorting.Ascending) {
                const c = bData;
                bData = aData;
                aData = c;
            }

            switch (aData.type) {
                case "Number":
                    return aData.value - (bData.value as number);
                case "String":
                case "Tag":
                    return aData.value.localeCompare(bData.value as string);
            }
        });

        return filteredTableData;
    }

    export function clickTableHead(header: TableHeaderDef) {
        const idx =
            tableHeaderState?.findIndex((v) => v.column === header.column) ??
            -1;
        if (idx === -1) {
            throw new Error(`found no header with name: ${header.column}`);
        }

        // TODO: WTF IS GOING ON
        for (let [i, sort] of tableSorting.entries()) {
            tableSorting[i] = 0;
            if (i === idx) {
                tableSorting[i] = (sort % 2) + 1;
            }
        }

        if (
            tableSorting.reduce((acc, v) => {
                return acc + v;
            }) === 0
        ) {
            tableSorting[0] = TableSorting.Descending;
        }
    }
</script>

{#snippet tableText(data: SummaryData)}
    {#if data.type === "String" || data.type === "Tag"}
        {#if data.abbreviation === "source"}
            {abbreviateSource(data.value)}
        {:else}
            {data.value}
        {/if}
    {:else if data.type === "Number"}
        {data.value}
        {#if data.unit === "feet"}
            {" feet"}
        {/if}
    {/if}
{/snippet}

{#snippet tableCell(data: SummaryData)}
    {#if data.type === "Tag"}
        <Tag color={COLOR_CATEGORIES.get(data.category)?.get(data.value)}>
            {@render tableText(data)}
        </Tag>
    {:else}
        {@render tableText(data)}
    {/if}
{/snippet}

<div class="compendium-table column">
    <div class="header row spaced-between">
        <h1>{compendiumRoute}</h1>
        <div class="row table-controls">
            <Searchbox bind:value={searchboxValue} />
        </div>
    </div>
    <Table class="table">
        <TableHeader>
            <TableRow>
                {#each tableHeaderState ?? [] as data, i (i)}
                    <TableHead
                        {data}
                        sortingData={tableSorting[i]}
                        onclick={() => clickTableHead(data)}
                    />
                {/each}
            </TableRow>
        </TableHeader>
        <TableBody>
            {#each getTableData() as summary, i (i)}
                <TableRow
                    href="/compendium/{compendiumRoute}/{summary.slug}#{summary.slug}"
                    selected={summary.slug === selectedRowSlug}
                >
                    {#each summary.data as summaryData, i (i)}
                        <TableCell>
                            {@render tableCell(summaryData)}
                        </TableCell>
                    {/each}
                </TableRow>
            {/each}
        </TableBody>
    </Table>
</div>

<style lang="scss">
    .compendium-table {
        flex: 1;
        height: 100%;
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

    .table-controls {
    }
</style>
