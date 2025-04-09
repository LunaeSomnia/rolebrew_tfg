<script lang="ts">
    import type { Attribute, BoostOrFlaw } from "$lib/bindings";

    let {
        boostOrFlaw,
        value = $bindable(),
    }: {
        boostOrFlaw: BoostOrFlaw;
        value: Attribute;
    } = $props();

    const allAttributes: Attribute[] = [
        "Strength",
        "Dexterity",
        "Constitution",
        "Intelligence",
        "Wisdom",
        "Charisma",
    ];
</script>

{#snippet buttonValue(attribute: Attribute)}
    <span class="tag">
        {attribute.toString().substring(0, 3)}
    </span>
{/snippet}

<div class="row attribute-selector">
    {#if boostOrFlaw.type === "free"}
        {#each allAttributes as attribute}
            <button
                onclick={() => (value = attribute)}
                class:active={value === attribute}
            >
                {@render buttonValue(attribute)}
            </button>
        {/each}
    {:else if boostOrFlaw.type === "choose"}
        {#each boostOrFlaw.atts as attribute}
            <button
                onclick={() => (value = attribute)}
                class:active={value === attribute}
            >
                {@render buttonValue(attribute)}
            </button>
        {/each}
    {:else}
        <button
            onclick={() => (value = boostOrFlaw.att)}
            class:active={value === boostOrFlaw.att}
        >
            {@render buttonValue(boostOrFlaw.att)}
        </button>
    {/if}
</div>

<style lang="scss">
    .attribute-selector {
        width: 100%;
    }
    button {
        padding: 0.5rem 1rem;
        border-radius: 0.5rem;
        font-size: inherit;
        font-family: inherit;
        font-weight: inherit;
        background-color: var(--dark-3);
        color: var(--light-2);
        cursor: pointer;
        width: 100%;

        &.active {
            background-color: var(--orange-darker);

            span {
                color: var(--orange-lighter);
            }
        }
    }
</style>
