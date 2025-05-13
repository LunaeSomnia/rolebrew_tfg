<script lang="ts">
    import type {
        Attribute,
        Proficiency,
        SavingThrow,
        SavingThrows,
    } from "$lib/bindings";
    import type { CharacterSimulationState } from "$lib/characterSimulator.svelte";
    import { roll } from "$lib/roll";
    import { capitalize } from "$lib/utils";
    import {
        proficiencyBonus,
        SAVING_THROW_TO_ATTRIBUTE,
    } from "../character-creator/characterCreator.svelte";
    import HorizontalDivisor from "../divisor/HorizontalDivisor.svelte";
    import VerticalDivisor from "../divisor/VerticalDivisor.svelte";
    import ModTooltip from "../ModTooltip.svelte";
    import { type ModAttribute } from "../ModTooltip.svelte";
    import Profifiency from "../Profifiency.svelte";
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
    {@const rules = simulationState.rulesAppliedToSelector(savingThrow)}
    {@const modifier =
        attributeModifiers[att] +
        pb +
        rules
            .map((v) => v.rule.getModifier(simulationState, [savingThrow]))
            .reduce((v, n) => v + n, 0)}
    {@const dc = modifier + 10}
    {@const attributeText = att.substring(0, 3)}

    {@const valueAttributes: ModAttribute[] = [
        {
            value: attributeModifiers[att],
            type: attributeText,
            modifier: '+'
        },
        {
            value: pb - level,
            isProficiency: true,
            type: proficiency[0],
            modifier: '+'
        },
        {
            value: level,
            type: "Lvl",
            modifier: '+'
        }
    ]}

    {@const dcAttributes: ModAttribute[] = valueAttributes.concat([{
        value: 10,
        type: "DC",
        modifier: '+'
    }])}

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
            <ModTooltip attributes={valueAttributes} finalValue={modifier}>
                <span class="value">{modifier >= 0 ? "+" : ""}{modifier}</span>
            </ModTooltip>
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
            <ModTooltip attributes={dcAttributes} finalValue={dc}>
                <span class="value">{modifier >= 0 ? "+" : ""}{dc}</span>
            </ModTooltip>
        </Rollable>
    </div>
{/snippet}

<div class="column saving-throws">
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
    .saving-throws {
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
