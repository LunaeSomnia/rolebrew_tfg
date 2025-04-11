<script lang="ts">
    import type { Attribute, Proficiency, Skill } from "$lib/bindings";
    import { capitalize } from "$lib/utils";
    import {
        BASIC_SKILL_TO_ATTRIBUTE,
        proficiencyBonus,
        scoreToModifier,
    } from "./character-creator/characterCreator.svelte";
    import HorizontalDivisor from "./divisor/HorizontalDivisor.svelte";
    import Profifiency from "./Profifiency.svelte";

    let {
        skills,
        additionalSkills,
        attributeModifiers,
        level,
    }: {
        skills: Record<Skill, Proficiency>;
        additionalSkills: Record<string, [Attribute, Proficiency]>;
        attributeModifiers: Record<Attribute, number>;
        level: number;
    } = $props();
</script>

{#snippet skillRender(
    skill: string,
    proficiency: Proficiency,
    attribute?: Attribute,
)}
    {@const finalAttribute =
        attribute ?? BASIC_SKILL_TO_ATTRIBUTE[skill as Skill]}
    {@const skillModifier =
        attributeModifiers[finalAttribute] +
        proficiencyBonus(proficiency, level)}
    <div class="row skill">
        <Profifiency {proficiency} />
        <div class="row text">
            <span class="skill-text">{capitalize(skill)}</span>
            <span class="tag">{finalAttribute.substring(0, 3)}</span>
        </div>
        <span class="value">{skillModifier >= 0 ? "+" : ""}{skillModifier}</span
        >
    </div>
{/snippet}

<div class="column skills">
    {#each Object.entries(skills) as [skill, proficiency]}
        {@render skillRender(skill, proficiency)}
    {/each}
    <HorizontalDivisor />
    {#each Object.entries(additionalSkills) as [skill, [attribute, proficiency]]}
        {@render skillRender(skill, proficiency, attribute)}
    {/each}
</div>

<style lang="scss">
    .skills {
        background-color: var(--dark-2);
        border-radius: 0.5rem;
        padding: 1rem;
        gap: 0.5rem;

        .skill {
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
    }
</style>
