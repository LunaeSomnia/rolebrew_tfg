<script lang="ts">
    import type { Attribute, Proficiency, Skill } from "$lib/bindings";
    import type { CharacterSimulationState } from "$lib/characterSimulator.svelte";
    import { roll } from "$lib/roll";
    import { capitalize } from "$lib/utils";
    import {
        BASIC_SKILL_TO_ATTRIBUTE,
        proficiencyBonus,
        scoreToModifier,
    } from "../character-creator/characterCreator.svelte";
    import Profifiency from "../Profifiency.svelte";
    import Tooltip from "../Tooltip.svelte";
    import Rollable from "./Rollable.svelte";

    let {
        simulationState,
        skills,
        attributeModifiers,
        level,
    }: {
        simulationState: CharacterSimulationState;
        skills: Record<Skill, Proficiency>;
        additionalSkills: Record<string, [Attribute, Proficiency]>;
        attributeModifiers: Record<Attribute, number>;
        level: number;
    } = $props();
</script>

<div class="column skills">
    {#each Object.entries(skills) as [skill, proficiency]}
        {@const attribute = BASIC_SKILL_TO_ATTRIBUTE[skill as Skill]}
        {@const pb = proficiencyBonus(proficiency, level)}
        {@const modifier = attributeModifiers[attribute] + pb}
        {@const attributeText = attribute.substring(0, 3)}

        {#snippet valueTooltip()}
            <span class="row skill-value-tooltip">
                {attributeModifiers[attribute]}
                (<span class="tag">{attributeText}</span>) +
                {pb - level}
                (<span class="tag">{proficiency[0]}</span>) +
                {level}
                (<span class="tag">Lvl</span>) = {modifier}
            </span>
        {/snippet}

        <Rollable
            onclick={() => {
                simulationState.pushChatMessage(
                    `rolled ${skill}: ${roll(20) + modifier}`,
                );
            }}
        >
            <div class="row skill">
                <Profifiency {proficiency} />
                <div class="row text">
                    <span class="skill-text">{capitalize(skill)}</span>
                    <span class="tag">{attributeText}</span>
                </div>
                <Tooltip textSnippet={valueTooltip}>
                    <span class="value"
                        >{modifier >= 0 ? "+" : ""}{modifier}</span
                    >
                </Tooltip>
            </div>
        </Rollable>
    {/each}
</div>

<style lang="scss">
    :global(.skill-value-tooltip) {
        align-items: baseline;
        gap: 0.125rem;
        color: var(--light-1);
    }

    .skills {
        position: relative;
        width: 100%;
        background-color: var(--dark-2);
        border-radius: 0.5rem;
        padding: 1rem;
        gap: 0.25rem;
    }

    :global(.skill) {
        position: relative;
        width: 100%;
        align-items: center;

        .text {
            flex: 1;
            align-items: baseline;
            gap: 0.5rem;
        }

        .skill-text {
            flex: 1;
        }

        .tag {
            font-size: 0.75rem;
        }
    }
</style>
