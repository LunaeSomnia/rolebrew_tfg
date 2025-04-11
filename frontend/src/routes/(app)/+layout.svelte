<script lang="ts">
    import Alert from "$lib/components/alert/Alert.svelte";
    import Navbar from "$lib/components/Navbar.svelte";
    import { appState } from "$lib/store.svelte";
    import { flip } from "svelte/animate";
    import type { LayoutProps } from "./$types";

    let { data, children }: LayoutProps = $props();
</script>

<Navbar basePath={data.basePath ?? ""} user={data.user} />
<div class="wrapper">
    <div class="column">
        {@render children()}
    </div>
</div>
<div class="alert-wrapper">
    {#each appState.alerts as alert (alert)}
        <div class="alert" animate:flip>
            <Alert {alert} id={alert.id} />
        </div>
    {/each}
</div>

<style lang="scss">
    .wrapper {
        display: grid;
        place-items: center;
        height: calc(100vh - 4rem);
    }

    .alert-wrapper {
        max-width: var(--max-width);
        position: absolute;
        transform: translate(-100%, -100%);
        left: 100%;
        top: 100%;
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;
        padding: 2rem;
        padding-top: 6rem;
        align-items: flex-end;
        justify-items: flex-end;
        user-select: none;
        pointer-events: none;
    }

    .wrapper > .column {
        width: 100%;
        height: 100%;
        max-width: var(--max-width);
        padding: 2rem 0;
        gap: 2rem;
        align-items: flex-start;
    }
</style>
