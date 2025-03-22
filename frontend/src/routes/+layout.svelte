<script lang="ts">
    import type { LayoutProps } from "./$types";

    let { children }: LayoutProps = $props();
</script>

<svelte:head>
    <title>Rolebrew</title>
</svelte:head>

{@render children()}
