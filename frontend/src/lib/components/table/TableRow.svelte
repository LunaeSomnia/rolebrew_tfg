<script lang="ts">
    import { goto } from "$app/navigation";
    import { type Snippet } from "svelte";
    import type { HTMLAttributes } from "svelte/elements";

    let {
        href,
        children,
        selected = false,
        altBackground = false,
        ...props
    }: HTMLAttributes<HTMLTableRowElement> & {
        "data-state"?: unknown;
        selected?: boolean;
        altBackground?: boolean;
    } & { href?: string; children: Snippet } = $props();
</script>

{#if href}
    <tr
        {...props}
        onclick={() => goto(href)}
        style="cursor: pointer;"
        class:selected
        class:altBackground
    >
        {@render children()}
    </tr>
{:else}
    <tr {...props} class:altBackground>
        {@render children()}
    </tr>
{/if}

<style lang="scss">
    tr {
        background-color: var(--dark-2);
        border-bottom: 0.125rem solid var(--dark-1);

        &.altBackground {
            background-color: var(--dark-3);
        }

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

        &.altBackground:hover {
            background-color: var(--dark-4);
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
