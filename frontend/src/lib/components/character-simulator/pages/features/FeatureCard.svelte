<script lang="ts">
    import type { Feat } from "$lib/bindings";
    import HorizontalDivisor from "$lib/components/divisor/HorizontalDivisor.svelte";
    import { Icon } from "$lib/icons/icons";
    import IconSvg from "$lib/icons/IconSVG.svelte";
    import {
        linkToLinkPreviewConverter,
        transformDescription,
    } from "$lib/textProcessing";

    let {
        feature,
        defaultOpen = true,
    }: {
        feature: Feat;
        defaultOpen?: boolean;
    } = $props();

    let open = $state(defaultOpen);
</script>

<button class="column accordion" class:open onclick={() => (open = !open)}>
    <div class="column accordion-header">
        <div class="row">
            <h6>{feature.name}</h6>
            <span class="level">Level {feature.level}</span>
        </div>
    </div>
    {#if open}
        <HorizontalDivisor />
        <p class="column">
            {@html linkToLinkPreviewConverter(
                transformDescription(feature.description),
            )}
        </p>
    {/if}
</button>

<style>
    .accordion {
        width: 100%;
        border: 0.125rem solid var(--dark-3);
        border-radius: 0.5rem;
        padding: 1rem;
        gap: 0.5rem;
        transition: all var(--transition-normal);
        background-color: unset;
        cursor: pointer;

        .level {
            color: var(--light-3);
            font-weight: 600;
        }

        &:hover {
            background-color: var(--dark-3);
        }

        p {
            color: var(--light-2);
            text-align: start;
        }
    }

    :global(.accordion:hover .divisor) {
        background-color: var(--dark-4);
    }

    .accordion-header {
        width: 100%;
        gap: 0;
        --icon-color: var(--light-3);
        transition: all var(--transition-normal);

        h6 {
            width: auto;
        }

        .row {
            align-items: center;
            width: 100%;
        }
    }
</style>
