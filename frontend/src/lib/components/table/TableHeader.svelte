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
        z-index: 0;
        box-shadow: 0px 0px 0.5rem 0px rgba(0, 0, 0, 0.5);
    }

    :global(thead tr) {
        border-bottom: 0.125rem solid var(--dark-3);
    }
</style>
