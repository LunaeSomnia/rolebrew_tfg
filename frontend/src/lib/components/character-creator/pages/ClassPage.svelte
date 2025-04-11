<script lang="ts">
    import type { Snippet } from "svelte";
    import {
        createFeatureDecisionTrees,
        createKeyAbilityDecisionTree,
        type CharacterState,
        type Choice,
        type DecisionTree,
    } from "../characterCreator.svelte";
    import Traits from "$lib/components/Traits.svelte";
    import FeatureCard from "../FeatureCard.svelte";
    import type { Class, BoostOrFlaw, Summary, Attribute } from "$lib/bindings";
    import { writable, type Writable } from "svelte/store";
    import {
        linkToLinkPreviewConverter,
        transformDescription,
    } from "$lib/textProcessing";
    import DecisionCard from "../DecisionCard.svelte";
    import ProficiencyLabel from "$lib/blocks/ProficiencyLabel.svelte";
    import FeatureLink from "../FeatureLink.svelte";
    import SkillSelector from "../SkillSelector.svelte";

    let {
        keyAbilityChosen = $bindable(),
        classBoosts = $bindable(),
        characterState = $bindable(),
        classSummaries = $bindable(),
        classDecisionsMade = $bindable(),
        list,
    }: {
        keyAbilityChosen: boolean;
        classDecisionsMade: Record<string, boolean[]>;
        classBoosts: BoostOrFlaw[];
        characterState: CharacterState;
        classSummaries: Summary[];
        list: Snippet<
            [Summary[], string | undefined, (selected: string) => void]
        >;
    } = $props();

    let classDecisionTrees: Record<string, DecisionTree[]> = $state({});
    let classData: Class | undefined = $derived(characterState.classData);

    let keyAbilityChoice: Choice[] = $state([]);

    $effect(() => {
        if (keyAbilityChoice.length === 1 && keyAbilityChoice[0]) {
            characterState.keyAbility = keyAbilityChoice[0].value as Attribute;
        }
    });

    function availableFeatures(classData: Class) {
        return (classData.features ?? []).filter(
            (v) => v.level <= characterState.level,
        );
    }

    async function onSelectClass(classSlug: string) {
        if (classSlug === characterState.class) return;
        characterState.class = classSlug;

        const classR = (await fetch("/api/class/" + classSlug).then((v) =>
            v.json(),
        )) as Class;
        characterState.class = classSlug;
        characterState.classData = classR;

        if (classData) {
            characterState.classDecisions = {};

            const features = availableFeatures(classData);
            for (const feature of features ?? []) {
                classDecisionTrees[feature.slug] =
                    await createFeatureDecisionTrees(feature);
                const trees = classDecisionTrees[feature.slug];
                characterState.classDecisions[feature.slug] = {};
                classDecisionsMade[feature.slug] = new Array(trees.length);
                for (let j = 0; j < trees.length; j++) {
                    const tree = trees[j];
                    characterState.classDecisions[feature.slug][tree.slug] = [];
                    classDecisionsMade[feature.slug][j] =
                        tree.choices.length === 0;
                }
            }

            keyAbilityChosen = true;
            if (classData.keyAbility) {
                if (classData.keyAbility.length > 1) {
                    keyAbilityChosen = false;
                } else if (classData.keyAbility.length === 1) {
                    characterState.keyAbility = classData.keyAbility[0];
                }
            }

            // classBoosts.set([...(classData.boosts ?? [])]);
            characterState.classDecisions = Object.fromEntries(
                Object.entries(characterState.classDecisions),
            );
        }
    }
</script>

{@render list(classSummaries, characterState.class, onSelectClass)}
<div class="column card">
    <div class="column wrapper">
        {#if characterState.class && classData}
            {@const classFeatures = availableFeatures(classData)}
            <div class="header row">
                <h3>{classData.name}</h3>
            </div>
            <Traits rarity={classData.rarity} traits={classData.traits} />
            <div class="column class-features">
                <FeatureCard id="ka" label="key ability">
                    {#if classData.keyAbility === undefined || classData.keyAbility?.length === 0}
                        <span>None</span>
                    {:else}
                        <span>{classData.keyAbility.join(" or ")}</span>
                    {/if}
                </FeatureCard>
                <FeatureCard id="hp" label="base hp">
                    <span>{classData.hp}</span>
                </FeatureCard>
                <FeatureCard id="p" label="perception">
                    <span>{classData.perception}</span>
                </FeatureCard>
                <FeatureCard id="at" label="attacks">
                    {#if classData.attacks.unarmed}
                        <ProficiencyLabel
                            proficiency="Trained"
                            label="Unarmed"
                        />
                    {/if}
                    {#if classData.attacks.simple}
                        <ProficiencyLabel
                            proficiency="Trained"
                            label="Simple"
                        />
                    {/if}
                    {#if classData.attacks.martial}
                        <ProficiencyLabel
                            proficiency="Trained"
                            label="Martial"
                        />
                    {/if}
                    {#if classData.attacks.advanced}
                        <ProficiencyLabel
                            proficiency="Trained"
                            label="Advanced"
                        />
                    {/if}
                    {#if classData.attacks.other.name !== ""}
                        <ProficiencyLabel
                            proficiency={classData.attacks.other.rank}
                            label={classData.attacks.other.name}
                        />
                    {/if}
                </FeatureCard>
                <FeatureCard id="de" label="defenses">
                    {#if classData.defenses.unarmored}
                        <ProficiencyLabel
                            proficiency="Trained"
                            label="Unarmored"
                        />
                    {/if}
                    {#if classData.defenses.light}
                        <ProficiencyLabel proficiency="Trained" label="Light" />
                    {/if}
                    {#if classData.defenses.medium}
                        <ProficiencyLabel
                            proficiency="Trained"
                            label="Medium"
                        />
                    {/if}
                    {#if classData.defenses.heavy}
                        <ProficiencyLabel proficiency="Trained" label="Heavy" />
                    {/if}
                </FeatureCard>
                <FeatureCard id="st" label="saving throws">
                    <ProficiencyLabel
                        proficiency={classData.savingThrows.fortitude}
                        label="Fortitude"
                    />
                    <ProficiencyLabel
                        proficiency={classData.savingThrows.reflex}
                        label="Reflex"
                    />
                    <ProficiencyLabel
                        proficiency={classData.savingThrows.will}
                        label="Will"
                    />
                </FeatureCard>
                <FeatureCard id="sk" label="skills">
                    {#each classData.trainedSkills.value as skill}
                        <ProficiencyLabel proficiency="Trained" label={skill} />
                    {/each}
                    <span
                        >Additional skills equal to {classData.trainedSkills
                            .additional}{classData.keyAbility
                            ? ` + your ${classData.keyAbility.join(" or ")}`
                            : ""}
                        modifier.</span
                    >
                </FeatureCard>
            </div>

            <div class="row gained-features" style="flex-wrap: wrap;">
                {#each (classData.features ?? [])
                    .filter((v) => v.level <= characterState.level)
                    .sort((a, b) => a.level - b.level) as feature}
                    <FeatureLink
                        name={feature.name}
                        level={feature.level}
                        href="/compendium/feat/{feature.slug}"
                    />
                {/each}
            </div>
            <p class="description column">
                {@html linkToLinkPreviewConverter(
                    transformDescription(classData.description),
                )}
            </p>
            <p class="disclaimer fancy">
                Boosts are selected in the "Finish" step
            </p>

            {#if classData.keyAbility && classData.keyAbility.length > 1}
                {@const decision = createKeyAbilityDecisionTree(
                    classData.keyAbility,
                )}
                <DecisionCard
                    from={classData.name}
                    label={decision.label}
                    {decision}
                    bind:value={keyAbilityChoice}
                    bind:allDecisionsMade={keyAbilityChosen}
                />
            {/if}

            {#each classFeatures as feature}
                {@const decisionTrees = classDecisionTrees[feature.slug]}
                {#each decisionTrees as decision, j}
                    {#if Object.entries(decisionTrees).length !== 0}
                        <DecisionCard
                            from={feature.name}
                            label={decision.label}
                            {decision}
                            bind:value={
                                characterState.classDecisions[feature.slug][
                                    decision.slug
                                ]
                            }
                            bind:allDecisionsMade={
                                classDecisionsMade[feature.slug][j]
                            }
                        />
                    {/if}
                {/each}
            {/each}
        {:else}
            <div class="not-selected">
                <p>Select an Ancestry to continue</p>
            </div>
        {/if}
    </div>
</div>

<style lang="scss">
    .card {
        width: 100%;
        height: 100%;
        gap: 1rem;
        overflow-y: auto;

        .wrapper {
            width: 100%;
            height: 0;
            flex-grow: 1;
        }
    }

    h1 {
        width: auto;
    }

    .row,
    .column {
        width: 100%;
    }
    .header {
        width: 100%;
        align-items: center;

        :global(.back-button) {
            width: 3rem;
            height: 3rem;
            border-radius: 1.5rem;
            padding: 0;
            display: grid;
            place-items: center;
        }
    }

    .wrapper {
        height: 100%;
        width: 100%;
        overflow-y: auto;
    }

    .not-selected {
        width: 100%;
        height: 100%;
        display: grid;
        place-items: center;
    }

    .header {
        h3 {
            width: auto;
        }
    }

    .level {
        width: 8rem;
    }

    .ancestry-features,
    .class-features,
    .class-features {
        width: 100%;
        gap: 0.125rem;
        border-radius: 0.5rem;
        display: grid;
    }

    .ancestry-features {
        grid-template-areas:
            "hp    l  l  baf baf"
            "size  al al baf baf"
            "speed al al baf baf";
        grid-template-columns: repeat(5, 1fr);
        grid-template-rows: repeat(3, auto);
    }

    .class-features {
        grid-template-areas: "boosts skills";
        grid-template-columns: repeat(2, 1fr);
        grid-template-rows: repeat(1, auto);
    }

    .class-features {
        grid-template-areas:
            "ka hp p"
            "at de de"
            "st sk sk";
        grid-template-columns: repeat(3, 1fr);
        grid-template-rows: repeat(2, auto);
    }

    .description {
        width: 100%;
        class-color: var(--dark-3);
        border-radius: 0.5rem;
        padding: 1rem;
    }

    .card-content {
        width: 100%;
        height: 0;
        flex-grow: 1;
        overflow-y: auto;
        gap: 0.5rem;
    }

    .disclaimer {
        width: 100%;
        text-align: center;
        color: var(--light-3);
    }
</style>
