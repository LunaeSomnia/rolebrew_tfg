<script lang="ts">
    import type { Attribute } from "$lib/bindings";
    import { scoreToModifier } from "../character-creator/characterCreator.svelte";

    let {
        attributes,
    }: {
        attributes: Record<Attribute, number>;
    } = $props();

    console.log(attributes);
</script>

{#snippet attribute(attribute: Attribute, value: number)}
    <div class="column attribute">
        <span class="tag">{attribute.toString().substring(0, 3)}</span>
        <span class="value">{value >= 0 ? "+" : ""}{value}</span>
    </div>
{/snippet}

<div class="row attributes spaced-between">
    {@render attribute("Strength", attributes.Strength)}
    {@render attribute("Dexterity", attributes.Dexterity)}
    {@render attribute("Constitution", attributes.Constitution)}
    {@render attribute("Intelligence", attributes.Intelligence)}
    {@render attribute("Wisdom", attributes.Wisdom)}
    {@render attribute("Charisma", attributes.Charisma)}
</div>

<style lang="scss">
    .attributes {
        flex: 1;
        align-self: stretch;
        background-color: var(--dark-2);
        border-radius: 0.5rem;
        gap: 0;
        overflow: hidden;
    }

    .attribute {
        flex: 1;
        padding: 0rem 1rem;
        align-items: center;
        gap: 0.5rem;
        height: 100%;
        justify-content: center;

        &:hover {
            background-color: var(--dark-3);
        }
    }

    .value {
        font-weight: bold;
        color: var(--light-1);
        font-size: 1.25rem;
    }
</style>
