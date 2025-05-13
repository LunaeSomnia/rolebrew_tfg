<script lang="ts">
    import type { Snippet } from "svelte";
    import Tooltip from "./Tooltip.svelte";
    import Profifiency from "./Profifiency.svelte";
    import type { Proficiency as PType } from "$lib/bindings";

    export type ModAttribute = {
        value: number;
        isProficiency?: boolean;
        type: string;
        modifier: "+" | "-" | "*" | "/";
    };

    let {
        children,
        attributes,
        finalValue,
    }: {
        children: Snippet;
        attributes: ModAttribute[];
        finalValue: number;
    } = $props();
</script>

{#snippet valueTooltip()}
    <div class="row skill-value-tooltip">
        {#each attributes as { value, isProficiency, type, modifier }, i}
            {#if i !== 0 || (i === 0 && modifier === "-")}
                <span class="modifier">{modifier}</span>
                <!-- <span style:color="var(--light-2)">=</span> -->
            {/if}
            <div class="column">
                <span class:disabled={value === 0}>
                    {value}
                </span>
                {#if isProficiency}
                    <Profifiency proficiency={type as PType} />
                {:else}
                    <span class="tag">{type}</span>
                {/if}
            </div>
        {/each}
        <span style:color="var(--light-2)">=</span>
        <span
            style="color: var(--orange); padding: 0 0.5rem; font-weight: bold;"
        >
            {finalValue}
        </span>
    </div>
{/snippet}

<Tooltip textSnippet={valueTooltip}>
    {@render children()}
</Tooltip>

<style>
    :global(.skill .tooltip) {
        padding: 0.25rem 0.5rem;
    }

    :global(.skill-value-tooltip) {
        align-items: baseline;
        gap: 0.125rem;
        color: var(--light-1);
        text-wrap: nowrap;
    }

    :global(.skill-value-tooltip .disabled) {
        color: var(--light-3);
    }

    :global(.skill-value-tooltip .column) {
        align-items: center;
        gap: 0.125rem;
    }

    :global(.skill-value-tooltip .column .tag) {
        padding: 0.25rem;
    }
</style>
