<script lang="ts">
    import type { Snippet } from "svelte";
    import type { HTMLTableAttributes } from "svelte/elements";

    let { children, ...props }: HTMLTableAttributes & { children: Snippet } =
        $props();
</script>

<div>
    <table {...props}>
        {@render children()}
    </table>
</div>

<style lang="scss">
    div {
        width: 100%;
        height: 100%;
        overflow-y: auto;
        border-radius: 0.5rem;
    }
    table {
        width: 100%;
        border-collapse: collapse;
    }
</style>
