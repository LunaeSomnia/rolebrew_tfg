<script lang="ts">
    import type { Action, Condition } from "$lib/bindings";
    import type { ConditionState } from "$lib/characterSimulator.svelte";
    import Input from "$lib/components/Input.svelte";
    import LinkPreview from "$lib/components/link-preview/LinkPreview.svelte";
    import { hrefToSummaryHref } from "$lib/textProcessing";

    let {
        condition = $bindable(),
    }: {
        condition: ConditionState;
    } = $props();

    let href = `/compendium/condition/${condition.definition.slug}`;
    let summaryHref = hrefToSummaryHref(href);

    let isValued = $derived(condition.definition.value !== null);
    let active = $derived(condition.isActive);

    function onClick() {
        if (!isValued) condition.active = !condition.active;
    }

    $effect(() => {
        console.log(isValued, active);
    });
</script>

<LinkPreview {href} {summaryHref} canBeClicked={false}>
    <button
        class="row condition-card"
        class:active
        class:isValued
        onclick={onClick}
    >
        {condition.definition.name}
        {#if isValued}
            <Input
                type="number"
                placeholder={0}
                min={0}
                max={4}
                bind:value={condition.value}
            />
        {/if}
    </button>
</LinkPreview>

<style lang="scss">
    :global(.condition-card) {
        width: fit-content;
        padding: 0.5rem 1rem;
        height: 2.5rem;
        border: 0.125rem solid var(--dark-3);
        background-color: unset;
        border-radius: 0.5rem;
        color: var(--light-1);
        --icon-color: var(--light-3);
        gap: 1rem;
        transition: all var(--transition-normal);
        user-select: none;
        font-family: inherit;
        font-size: inherit;
        letter-spacing: inherit;
        font-weight: inherit;

        &.isValued {
            padding: 0 0.5rem 0 1rem;
            align-items: center;
        }

        &.active {
            color: var(--orange-lighter);
            background-color: var(--orange-darker);
            border-color: var(--orange-darker);
        }

        &:hover {
            --icon-color: var(--light-2);
            background-color: var(--dark-3);
        }
    }

    :global(.condition-card input) {
        padding: 0 0.5rem;
        height: 1.5rem;
        width: 3rem;
        border-radius: 0.25rem;
    }

    :global(.condition-card .input-field) {
        border-radius: 0.25rem;
    }

    :global(.conditions span) {
        text-decoration: none !important;
    }
</style>
