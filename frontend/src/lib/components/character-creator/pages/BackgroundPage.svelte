<script lang="ts">
    import type { Snippet } from "svelte";
    import {
        createBackgroundDecisionTrees,
        type CharacterState,
        type DecisionTree,
    } from "../characterCreator.svelte";
    import Traits from "$lib/components/Traits.svelte";
    import FeatureCard from "../FeatureCard.svelte";
    import type { Background, BoostOrFlaw, Summary } from "$lib/bindings";
    import { writable, type Writable } from "svelte/store";
    import {
        linkToLinkPreviewConverter,
        transformDescription,
    } from "$lib/textProcessing";
    import DecisionCard from "../DecisionCard.svelte";
    import ProficiencyLabel from "$lib/blocks/ProficiencyLabel.svelte";
    import FeatureLink from "../FeatureLink.svelte";
    import { capitalize } from "$lib/utils";

    let {
        backgroundBoosts: backgroundBoostsToChoose = $bindable(),
        characterState = $bindable(),
        backgroundSummaries = $bindable(),
        backgroundDecisionsMade = $bindable(),
        list,
    }: {
        backgroundBoosts: BoostOrFlaw[];
        characterState: CharacterState;
        backgroundSummaries: Summary[];
        backgroundDecisionsMade: boolean[];
        list: Snippet<
            [Summary[], string | undefined, (selected: string) => void]
        >;
    } = $props();

    let backgroundDecisionTrees = $state<DecisionTree[]>([]);
    let backgroundData = $derived(characterState.backgroundData);

    async function onSelectBackground(backgroundSlug: string) {
        if (backgroundSlug === characterState.background) return;
        characterState.background = backgroundSlug;

        const background = (await fetch(
            "/api/background/" + backgroundSlug,
        ).then((v) => v.json())) as Background;
        characterState.background = backgroundSlug;
        characterState.backgroundData = background;

        if (backgroundData) {
            backgroundDecisionTrees =
                await createBackgroundDecisionTrees(backgroundData);

            characterState.backgroundDecisions = {};
            backgroundDecisionsMade = new Array(backgroundDecisionTrees.length);
            for (let i = 0; i < backgroundDecisionTrees.length; i++) {
                const tree = backgroundDecisionTrees[i];
                characterState.backgroundDecisions[tree.slug] = new Array(
                    backgroundDecisionTrees.length,
                );
                backgroundDecisionsMade[i] = tree.choices.length === 0;
            }

            characterState.backgroundAdditionalSkills = {};
            for (const additionalSkill of backgroundData.trainedSkills.lore ??
                []) {
                characterState.backgroundAdditionalSkills[additionalSkill] = [
                    "Intelligence",
                    "Trained",
                ];
            }

            backgroundBoostsToChoose = [...(backgroundData.boosts ?? [])];
            characterState.backgroundDecisions = Object.fromEntries(
                Object.entries(characterState.backgroundDecisions),
            );
            characterState.backgroundBoosts = new Array(
                backgroundBoostsToChoose.length,
            );
        }
    }
</script>

{@render list(
    backgroundSummaries,
    characterState.background,
    onSelectBackground,
)}
<div class="column card">
    <div class="column wrapper">
        {#if characterState.background && backgroundData}
            <div class="header row">
                <h3>{backgroundData.name}</h3>
            </div>
            <Traits
                rarity={backgroundData.rarity}
                traits={backgroundData.traits}
            />
            <div class="column background-features">
                <FeatureCard id="boosts" label="boosts">
                    {#if backgroundData.boosts}
                        {#each backgroundData.boosts as boost}
                            {#if boost.type === "free"}
                                <span>Free Ability Boost</span>
                            {:else if boost.type === "grant"}
                                <span>{capitalize(boost.att)}</span>
                            {:else if boost.type === "choose"}
                                <span
                                    >{boost.atts
                                        .map(capitalize)
                                        .join(" or ")}</span
                                >
                            {/if}
                        {/each}
                    {/if}
                </FeatureCard>
                <FeatureCard id="skills" label="skills">
                    {#each backgroundData.trainedSkills.value ?? [] as skill}
                        <ProficiencyLabel
                            proficiency="Trained"
                            label={capitalize(skill)}
                        />
                    {/each}
                    {#each backgroundData.trainedSkills.lore ?? [] as skill}
                        <ProficiencyLabel
                            proficiency="Trained"
                            label={capitalize(skill)}
                        />
                    {/each}
                </FeatureCard>
            </div>
            <div class="row gained-features" style="flex-wrap: wrap;">
                {#each backgroundData.features ?? [] as feature}
                    <FeatureLink
                        name={feature.name}
                        level={feature.level}
                        href="/compendium/feat/{feature.slug}"
                    />
                {/each}
            </div>
            <p class="description column">
                {@html linkToLinkPreviewConverter(
                    transformDescription(backgroundData.description),
                )}
            </p>
            <p class="disclaimer fancy">
                Boosts are selected in the "Finish" step
            </p>

            {#each backgroundDecisionTrees as decision, i}
                {#if Object.entries(characterState.backgroundDecisions).length !== 0}
                    <DecisionCard
                        from={backgroundData.name}
                        label={decision.label}
                        {decision}
                        bind:value={
                            characterState.backgroundDecisions[decision.slug]
                        }
                        bind:allDecisionsMade={backgroundDecisionsMade[i]}
                    />
                {/if}
            {/each}
        {:else}
            <div class="not-selected">
                <p>Select an Background to continue</p>
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
    .background-features,
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

    .background-features {
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
        background-color: var(--dark-3);
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
