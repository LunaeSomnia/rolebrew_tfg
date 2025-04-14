<script lang="ts">
    import type { Attribute } from "$lib/bindings";
    import type { CharacterSimulationState } from "$lib/characterSimulator.svelte";
    import { roll } from "$lib/roll";
    import { scoreToModifier } from "../character-creator/characterCreator.svelte";
    import Rollable from "./Rollable.svelte";

    let {
        simulationState,
        attributes,
    }: {
        simulationState: CharacterSimulationState;
        attributes: Record<Attribute, number>;
    } = $props();

    console.log(attributes);
</script>

{#snippet attribute(attribute: Attribute, value: number)}
    <Rollable
        style="width: 100%;"
        onclick={() => {
            simulationState.pushChatMessage(
                `rolled ${attribute}: ${roll(20) + value}`,
            );
        }}
    >
        <div class="column attribute">
            <span class="tag">{attribute.toString().substring(0, 3)}</span>
            <span class="value">{value >= 0 ? "+" : ""}{value}</span>
        </div>
    </Rollable>
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
        position: relative;
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
    }

    .value {
        font-weight: bold;
        color: var(--light-1);
        font-size: 1.25rem;
    }
</style>
