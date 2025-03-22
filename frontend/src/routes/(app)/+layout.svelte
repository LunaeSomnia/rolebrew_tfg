<script lang="ts">
    import Navbar from "$lib/Navbar.svelte";
    import type { LayoutProps } from "./$types";

    let { data, children }: LayoutProps = $props();
</script>

<Navbar basePath={data.basePath ?? ""} />
<div class="wrapper">
    <div class="column">
        {@render children()}
    </div>
</div>

<style lang="scss">
    .wrapper {
        display: grid;
        place-items: center;
    }

    .column {
        width: 100%;
        max-width: var(--max-width);
        padding: 8rem 0;
        gap: 2rem;
        align-items: flex-start;
    }
</style>
