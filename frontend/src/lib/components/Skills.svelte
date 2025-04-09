<script lang="ts">
    import type { Attribute, Proficiency, Skill } from "$lib/bindings";
    import {
        BASIC_SKILL_TO_ATTRIBUTE,
        proficiencyBonus,
        scoreToModifier,
    } from "./character-creator/characterCreator.svelte";
    import Profifiency from "./Profifiency.svelte";

    let {
        skills,
        additionalSkills,
        attributeScores,
        level,
    }: {
        skills: Record<Skill, Proficiency>;
        additionalSkills: Record<string, [Attribute, Proficiency]>;
        attributeScores: Record<Attribute, number>;
        level: number;
    } = $props();
</script>

<div class="column skills">
    {#each Object.entries(skills) as [skill, proficiency]}
        {@const attribute = BASIC_SKILL_TO_ATTRIBUTE[skill as Skill]}
        {@const modifier =
            scoreToModifier(attributeScores[attribute]) +
            proficiencyBonus(proficiency, level)}
        <div class="row skill">
            <Profifiency {proficiency} />
            <div class="row text">
                <span class="skill-text">{skill}</span>
                <span class="tag">{attribute.substring(0, 3)}</span>
            </div>
            <span class="value">{modifier >= 0 ? "+" : ""}{modifier}</span>
        </div>
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
