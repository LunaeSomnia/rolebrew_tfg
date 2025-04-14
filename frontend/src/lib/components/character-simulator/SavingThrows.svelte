<script lang="ts">
    import type {
        Attribute,
        Proficiency,
        SavingThrow,
        SavingThrows,
        Skill,
    } from "$lib/bindings";
    import type { CharacterSimulationState } from "$lib/characterSimulator.svelte";
    import { roll } from "$lib/roll";
    import { capitalize } from "$lib/utils";
    import {
        BASIC_SKILL_TO_ATTRIBUTE,
        proficiencyBonus,
        SAVING_THROW_TO_ATTRIBUTE,
        scoreToModifier,
    } from "../character-creator/characterCreator.svelte";
    import HorizontalDivisor from "../divisor/HorizontalDivisor.svelte";
    import VerticalDivisor from "../divisor/VerticalDivisor.svelte";
    import Profifiency from "../Profifiency.svelte";
    import Tooltip from "../Tooltip.svelte";
    import Rollable from "./Rollable.svelte";

    let {
        simulationState,
        level,
        keyAbility,
        attributeModifiers,
        savingThrows,
    }: {
        simulationState: CharacterSimulationState;
        level: number;
        keyAbility: Attribute;
        attributeModifiers: Record<Attribute, number>;
        savingThrows: SavingThrows;
    } = $props();
</script>

{#snippet savingThrow(
    savingThrow: string,
    proficiency: Proficiency,
    attribute?: Attribute,
)}
    {@const att = attribute
        ? attribute
        : SAVING_THROW_TO_ATTRIBUTE[savingThrow as SavingThrow | "perception"]}
    {@const pb = proficiencyBonus(proficiency, level)}
    {@const modifier = attributeModifiers[att] + pb}
    {@const dc = modifier + 10}
    {@const attributeText = att.substring(0, 3)}

    {#snippet valueTooltip()}
        <span class="row skill-value-tooltip">
            {attributeModifiers[att]}
            (<span class="tag">{attributeText}</span>) +
            {pb - level}
            (<span class="tag">{proficiency[0]}</span>) +
            {level}
            (<span class="tag">Lvl</span>) = {modifier}
        </span>
    {/snippet}
    {#snippet dcTooltip()}
        <span class="row skill-value-tooltip">
            {attributeModifiers[att]}
            (<span class="tag">{attributeText}</span>) +
            {pb - level}
            (<span class="tag">{proficiency[0]}</span>) +
            {level}
            (<span class="tag">Lvl</span>) +
            {10}
            (<span class="tag">DC</span>) = {modifier}
        </span>
    {/snippet}
    <div class="row saving-throw">
        <Rollable
            style="width: 100%;"
            expandOnHover={true}
            onclick={() => {
                simulationState.pushChatMessage(
                    `rolled ${capitalize(savingThrow)}: ${roll(20) + modifier}`,
                );
            }}
        >
            <Profifiency {proficiency} />
            <span class="saving-throw-text">{capitalize(savingThrow)}</span>
            <span class="tag">{attributeText}</span>
            <Tooltip textSnippet={valueTooltip}>
                <span class="value">{modifier >= 0 ? "+" : ""}{modifier}</span>
            </Tooltip>
        </Rollable>
        <VerticalDivisor />
        <Rollable
            style="width: fit-content;"
            expandOnHover={true}
            onclick={() => {
                simulationState.pushChatMessage(
                    `rolled ${capitalize(savingThrow)} DC: ${roll(20) + modifier}`,
                );
            }}
        >
            <Tooltip textSnippet={dcTooltip}>
                <span class="value">{dc >= 0 ? "+" : ""}{dc}</span>
            </Tooltip>
        </Rollable>
    </div>
{/snippet}

<div class="column skills">
    {@render savingThrow("fortitude", savingThrows["fortitude"])}
    {@render savingThrow("reflex", savingThrows["reflex"])}
    {@render savingThrow("will", savingThrows["will"])}
    <HorizontalDivisor />
    {@render savingThrow("class dc", savingThrows["classDc"], keyAbility)}
    {@render savingThrow("perception", savingThrows["perception"])}
</div>

<style lang="scss">
    .row {
        height: 100%;
    }
    .skills {
        position: relative;
        width: 100%;
        background-color: var(--dark-2);
        border-radius: 0.5rem;
        padding: 1rem;
        gap: 0.5rem;

        .saving-throw {
            position: relative;
            width: 100%;
            align-items: center;

            .saving-throw-text {
                flex: 1;
            }

            .tag {
                font-size: 0.75rem;
            }
        }
    }
</style>
