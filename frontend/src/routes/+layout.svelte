<script lang="ts">
    import Navbar from "$lib/Navbar.svelte";
    import type { LayoutProps } from "./$types";

    let { data, children }: LayoutProps = $props();
</script>

<Navbar />
{@render children()}
