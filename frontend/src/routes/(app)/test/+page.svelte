<script lang="ts">
    import DecisionCard from "$lib/components/character-creator/DecisionCard.svelte";
    import Select from "$lib/components/Select.svelte";
    import { Icon } from "$lib/icons/icons";
    import type { Ancestry, Proficiency, Skill } from "$lib/bindings";
    import {
        createAncestryHeritageDecisionTree,
        type Choice,
    } from "$lib/components/character-creator/characterCreator.svelte.js";
    import AttributeScoreCreation from "$lib/components/character-creator/AttributeScoreCreation.svelte";
    import Skills from "$lib/components/Skills.svelte";

    let { data } = $props();

    let attributeScoreCreationAllChosen = $state(false);
    let attributeScores = $state({
        Strength: 0,
        Dexterity: 0,
        Constitution: 0,
        Intelligence: 0,
        Wisdom: 0,
        Charisma: 0,
    });

    let skills: Record<Skill, Proficiency> = $state({
        Acrobatics: "Untrained",
        Arcana: "Legendary",
        Athletics: "Master",
        Crafting: "Untrained",
        Deception: "Trained",
        Diplomacy: "Untrained",
        Intimidation: "Untrained",
        Medicine: "Untrained",
        Nature: "Trained",
        Occultism: "Untrained",
        Performance: "Trained",
        Religion: "Untrained",
        Society: "Untrained",
        Stealth: "Trained",
        Survival: "Untrained",
        Thievery: "Expert",
    });

    let selectValue: Choice[] = $state([]);

    const selectChoices = [
        { value: "light-monochrome", label: "Light Monochrome" },
        { value: "dark-green", label: "Dark Green" },
        { value: "svelte-orange", label: "Svelte Orange" },
        { value: "punk-pink", label: "Punk Pink" },
        { value: "ocean-blue", label: "Ocean Blue", disabled: true },
        { value: "sunset-orange", label: "Sunset Orange" },
    ];
</script>

<section class="column" style="width: 30rem;">
    <AttributeScoreCreation
        bind:allChosen={attributeScoreCreationAllChosen}
        bind:value={attributeScores}
    />
</section>

<section>
    <Skills level={3} {skills} additionalSkills={{}} {attributeScores} />
</section>

<section class="column">
    <Select
        choices={selectChoices}
        placeholder="Select a Theme"
        iconLeft={Icon.Logo}
    ></Select>
</section>

{#await data.ancestryRequest then ancestry: Ancestry}
    {#await createAncestryHeritageDecisionTree(ancestry) then selectDecisionTree}
        <DecisionCard
            from={ancestry.name}
            label="Heritage"
            decision={selectDecisionTree}
            bind:value={selectValue}
            allDecisionsMade={false}
        />
    {/await}
{/await}
