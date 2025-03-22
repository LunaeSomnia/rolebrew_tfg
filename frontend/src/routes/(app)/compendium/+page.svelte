<script lang="ts">
    import CompendiumAside from "$lib/CompendiumAside.svelte";
    import type { PageProps } from "./$types";

    let { data }: PageProps = $props();
</script>

<div class="compendium row">
    <CompendiumAside compendiumSection={data.compendiumSection} />
    <div class="compendium-table column"><h1>The Compendium</h1></div>
</div>

<style lang="scss">
    .compendium {
        width: 100%;
        align-items: flex-start;
    }

    .compendium-table {
        flex: 1;
        height: 100%;
    }

    .row {
        gap: 2rem;
    }
</style>
