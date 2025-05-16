<script lang="ts">
    import type { Attribute, Proficiency, Skill } from "$lib/bindings";
    import type { CharacterSimulationState } from "$lib/characterSimulator.svelte";
    import {
        ChatMessageType,
        type ModAttribute,
        type ModifierRollChatMessage,
    } from "$lib/chat";
    import { roll } from "$lib/roll";
    import type { SkillItem } from "$lib/simulationItem.svelte";
    import { capitalize } from "$lib/utils";
    import {
        BASIC_SKILL_TO_ATTRIBUTE,
        proficiencyBonus,
        scoreToModifier,
    } from "../character-creator/characterCreator.svelte";
    import ModTooltip from "../ModTooltip.svelte";
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
        skills: Record<Skill, SkillItem>;
        additionalSkills: Record<string, [Attribute, Proficiency]>;
        attributeModifiers: Record<Attribute, number>;
        level: number;
    } = $props();

    $effect(() => {
        $inspect(simulationState.activeRules);
    });
</script>

<div class="column skills">
    {#each Object.entries(skills) as [skill, item]}
        {@const attribute = BASIC_SKILL_TO_ATTRIBUTE[skill as Skill]}
        {@const pb = proficiencyBonus(item.proficiency, level)}
        {@const rules = simulationState.rulesAppliedToSelectors(item.selectors)}
        {@const modifier =
            attributeModifiers[attribute] +
            pb +
            rules
                .map((v) => v.rule.getModifier(simulationState, v.from))
                .reduce((v, n) => v + n, 0)}
        {@const attributeText = attribute.substring(0, 3)}

        {@const attributes: ModAttribute[] = [
            {
                value: attributeModifiers[attribute],
                type: attributeText,
                modifier: "+",
            },
            {
                value: pb - level,
                isProficiency: true,
                type: item.proficiency,
                modifier: "+",
            },
            {
                value: level,
                type: "Lvl",
                modifier: "+",
            },
        ]}

        <Rollable
            expandOnHover={true}
            onclick={() => {
                const rollV = roll(20);
                simulationState.pushChatMessage(ChatMessageType.ModifierRoll, {
                    name: `Rolled ${capitalize(skill)}`,
                    modifiers: [
                        {
                            modifier: "+",
                            type: "Roll",
                            value: rollV,
                        },
                        {
                            modifier: "+",
                            type: attribute,
                            value: modifier,
                        },
                    ],
                    roll: rollV,
                } as ModifierRollChatMessage);
            }}
        >
            <div class="row skill">
                <Profifiency proficiency={item.proficiency} />
                <div class="row text">
                    <span class="skill-text">{capitalize(skill)}</span>
                    <span class="tag">{attributeText}</span>
                </div>
                <ModTooltip {attributes} finalValue={modifier}>
                    <span class="value">
                        {modifier >= 0 ? "+" : ""}{modifier}
                    </span>
                </ModTooltip>
            </div>
        </Rollable>
    {/each}
</div>

<style lang="scss">
    .skills {
        position: relative;
        width: 100%;
        background-color: var(--dark-2);
        border-radius: 0.5rem;
        padding: 1rem;
        gap: 0.5rem;
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
