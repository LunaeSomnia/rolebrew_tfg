<script lang="ts">
    import CompendiumAside from "$lib/CompendiumAside.svelte";
    import CompendiumTable from "$lib/CompendiumTable.svelte";
    import { CompendiumSection, TABLE_HEADERS } from "$lib/compendiumTableDef";
    import type { LayoutProps } from "./$types";

    let { data, children }: LayoutProps = $props();
</script>

<div class="compendium row">
    <CompendiumAside compendiumSection={data.compendiumSection} />
    <CompendiumTable
        selectedRowSlug={data.compendiumPage}
        tableData={data.tableSummaryData}
        compendiumSection={CompendiumSection.Ancestry}
    />
</div>
{@render children()}

<style lang="scss">
    .row {
        gap: 2rem;
    }
</style>
