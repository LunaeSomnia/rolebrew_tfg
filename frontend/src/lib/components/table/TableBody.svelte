<script lang="ts">
    import type { HTMLAttributes } from "svelte/elements";
    import type { Snippet } from "svelte";

    let {
        children,
        ...props
    }: HTMLAttributes<HTMLTableSectionElement> & { children: Snippet } =
        $props();
</script>

<tbody {...props}>
    {@render children()}
</tbody>
