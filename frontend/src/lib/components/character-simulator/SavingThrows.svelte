<script lang="ts">
    import type {
        Attribute,
        Proficiency,
        SavingThrow,
        SavingThrows,
        Skill,
    } from "$lib/bindings";
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

    let {
        level,
        keyAbility,
        attributeModifiers,
        savingThrows,
    }: {
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
        <Profifiency {proficiency} />
        <div class="row text">
            <span class="saving-throw-text">{capitalize(savingThrow)}</span>
            <span class="tag">{attributeText}</span>
        </div>
        <div class="row" style="gap: 0.5rem;">
            <Tooltip textSnippet={valueTooltip}>
                <span class="value">{modifier >= 0 ? "+" : ""}{modifier}</span>
            </Tooltip>
            <VerticalDivisor />
            <Tooltip textSnippet={dcTooltip}>
                <span class="value">{dc >= 0 ? "+" : ""}{dc}</span>
            </Tooltip>
        </div>
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
        width: 100%;
        background-color: var(--dark-2);
        border-radius: 0.5rem;
        padding: 1rem;
        gap: 0.5rem;

        .saving-throw {
            width: 100%;
            align-items: center;

            .text {
                flex: 1;
                align-items: baseline;
                gap: 0.5rem;
            }

            .saving-throw-text {
                flex: 1;
            }

            .tag {
                font-size: 0.75rem;
            }
        }
    }
</style>
