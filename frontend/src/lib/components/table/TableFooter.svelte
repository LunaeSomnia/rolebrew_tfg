<script lang="ts">
    import type { HTMLAttributes } from "svelte/elements";
    import type { Snippet } from "svelte";

    let {
        children,
        ...props
    }: HTMLAttributes<HTMLTableSectionElement> & { children: Snippet } =
        $props();
</script>

<tfoot {...props}>
    {@render children()}
</tfoot>
