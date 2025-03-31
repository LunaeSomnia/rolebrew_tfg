<script lang="ts">
    import { page } from "$app/state";
    import Navbar from "$lib/components/Navbar.svelte";
    import type { LayoutProps } from "./$types";

    let { data, children }: LayoutProps = $props();
</script>

<Navbar basePath={data.basePath ?? ""} user={data.user} />
<main>
    <div class="wrapper">
        {#if page.status === 500}
            <p class="label">~~ Something went TERRIBLY wrong</p>
            <div class="row">
                <h1 class="label">{page.status}:</h1>
                <h1>Server Error</h1>
            </div>
        {:else}
            <p class="label">~~ Something went wrong</p>
            <div class="row">
                <h1 class="label">{page.status}:</h1>
                <h1>{page.error?.message}</h1>
            </div>
        {/if}
    </div>
</main>

<style lang="scss">
    main {
        padding: 8rem 0;
        display: grid;
        place-items: center;
    }

    .wrapper {
        width: 100%;
        align-self: center;
        max-width: var(--max-width);
        padding: 2rem 0;
    }

    h1 {
        width: auto;
    }

    .row {
        gap: 1rem;
    }
</style>
