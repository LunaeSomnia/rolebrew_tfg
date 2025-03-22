<script lang="ts">
    import type { Snippet } from "svelte";
    import type { HTMLTdAttributes } from "svelte/elements";

    let { children, ...props }: HTMLTdAttributes & { children: Snippet } =
        $props();
</script>

<td {...props}>
    {@render children()}
</td>

<style lang="scss">
    td {
        padding: 0.5rem;
    }
</style>
