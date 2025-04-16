<script lang="ts">
    import { Accordion, type WithoutChildrenOrChild } from "bits-ui";
    import type { Snippet } from "svelte";
    import HorizontalDivisor from "../divisor/HorizontalDivisor.svelte";
    import IconSvg from "$lib/icons/IconSVG.svelte";
    import { Icon } from "$lib/icons/icons";

    let {
        title,
        children,
        defaultOpen = true,
    }: {
        title: string;
        children: Snippet;
        defaultOpen?: boolean,
    } = $props();

    let open = $state(defaultOpen);
</script>

<button class="column accordion-header" class:open onclick={() => (open = !open)}>
    <div class="row spaced-between">
        <span class="tag">{title}</span>
        <div class="icon-wrapper">
            <IconSvg icon={Icon.ChevronUp} />
        </div>
    </div>
    <HorizontalDivisor />
</button>

{#if open}
    {@render children()}
{/if}

<style>
    .accordion-header {
        width: 100%;
        background-color: unset;
        gap: 0;
        --icon-color: var(--light-3);
        transition: all var(--transition-normal);

        .icon-wrapper {
            transition: all var(--transition-quick);

        }

        &.open .icon-wrapper {
            transform: rotate(180deg);
        }

        .row {
            align-items: center;
            width: 100%;
        }
    }
</style>
