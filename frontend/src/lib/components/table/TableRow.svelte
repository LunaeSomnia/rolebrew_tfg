<script lang="ts">
    import { goto } from "$app/navigation";
    import type { Snippet } from "svelte";
    import type { HTMLAttributes } from "svelte/elements";

    let {
        href,
        children,
        selected = false,
        ...props
    }: HTMLAttributes<HTMLTableRowElement> & {
        "data-state"?: unknown;
        selected?: boolean;
    } & { href?: string; children: Snippet } = $props();
</script>

{#if href}
    <tr
        {...props}
        onclick={() => goto(href)}
        style="cursor: pointer;"
        class:selected
    >
        {@render children()}
    </tr>
{:else}
    <tr {...props}>
        {@render children()}
    </tr>
{/if}

<style lang="scss">
    tr {
        background-color: var(--dark-2);
        border-bottom: 0.125rem solid var(--dark-1);

        &.selected {
            background: color-mix(
                in hsl shorter hue,
                #{var(--dark-2)},
                #{var(--orange)} 20%
            );
            color: var(--orange-lighter);
        }

        &:hover {
            background-color: var(--dark-3);
        }

        &:hover.selected {
            background: color-mix(
                in hsl shorter hue,
                #{var(--dark-3)},
                #{var(--orange)} 20%
            );
        }
    }
</style>
