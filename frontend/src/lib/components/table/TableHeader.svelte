<script lang="ts">
    import type { Snippet } from "svelte";
    import type { HTMLAttributes } from "svelte/elements";

    let {
        children,
        ...props
    }: HTMLAttributes<HTMLTableSectionElement> & { children: Snippet } =
        $props();
</script>

<thead {...props}>
    {@render children()}
</thead>

<style lang="scss">
    thead {
        position: sticky;
        top: 0;
        overflow: hidden;
    }
</style>
