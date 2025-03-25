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
        compendiumSection={CompendiumSection.Feat}
    />
</div>
{@render children()}

<style lang="scss">
    .compendium {
        width: 100%;
        max-width: 100%;
        align-items: flex-start;
        height: 100%;
        max-height: 50rem;
    }

    .row {
        gap: 2rem;
    }
</style>
