<script lang="ts">
    import type { Snippet } from "svelte";
    import {
        createAncestryDecisionTrees,
        createAncestryHeritageDecisionTree,
        type CharacterState,
        type DecisionTree,
    } from "../characterCreator.svelte";
    import Traits from "$lib/components/Traits.svelte";
    import FeatureCard from "../FeatureCard.svelte";
    import type { Ancestry, BoostOrFlaw, Summary } from "$lib/bindings";
    import { writable, type Writable } from "svelte/store";
    import {
        linkToLinkPreviewConverter,
        transformDescription,
    } from "$lib/textProcessing";
    import DecisionCard from "../DecisionCard.svelte";
    import { capitalize } from "$lib/utils";

    let {
        ancestryBoosts: ancestryBoostsToChoose = $bindable(),
        ancestryFlaws = $bindable(),
        characterState = $bindable(),
        ancestrySummaries = $bindable(),
        ancestryDecisionsMade = $bindable(),
        heritageDecisionsMade = $bindable(),
        list,
    }: {
        ancestryBoosts: BoostOrFlaw[];
        ancestryFlaws: BoostOrFlaw[];
        characterState: CharacterState;
        ancestrySummaries: Summary[];
        ancestryDecisionsMade: boolean[];
        heritageDecisionsMade: boolean;
        list: Snippet<
            [Summary[], string | undefined, (selected: string) => void]
        >;
    } = $props();

    let ancestryDecision = $state<DecisionTree[]>([]);
    let heritageDecision = $state<DecisionTree | undefined>();
    let ancestryData = $derived(characterState.ancestryData);

    async function onSelectAncestry(ancestrySlug: string) {
        if (ancestrySlug === characterState.ancestry) return;
        characterState.ancestry = ancestrySlug;

        const ancestry = (await fetch("/api/ancestry/" + ancestrySlug).then(
            (v) => v.json(),
        )) as Ancestry;
        characterState.ancestry = ancestrySlug;
        characterState.ancestryData = ancestry;

        if (ancestryData) {
            ancestryDecision = await createAncestryDecisionTrees(ancestryData);
            heritageDecision =
                await createAncestryHeritageDecisionTree(ancestryData);

            characterState.ancestryDecisions = {};
            characterState.heritageDecisions = [];
            heritageDecisionsMade = false;
            ancestryDecisionsMade = new Array(ancestryDecision.length);
            for (let i = 0; i < ancestryDecision.length; i++) {
                const tree = ancestryDecision[i];
                characterState.ancestryDecisions[tree.slug] = new Array(
                    ancestryDecision.length,
                );
                ancestryDecisionsMade[i] = tree.choices.length === 0;
            }

            ancestryDecisionsMade = [...ancestryDecisionsMade];
            ancestryBoostsToChoose = [...(ancestryData.boosts ?? [])];
            ancestryFlaws = [...(ancestryData.flaws ?? [])];
            characterState.ancestryDecisions = Object.fromEntries(
                Object.entries(characterState.ancestryDecisions),
            );
            characterState.ancestryBoosts = new Array(
                ancestryBoostsToChoose.length,
            );
        }
    }
</script>

{@render list(ancestrySummaries, characterState.ancestry, onSelectAncestry)}
<div class="column card">
    <div class="column wrapper">
        {#if characterState.ancestry && ancestryData}
            <div class="header row">
                <h3>{ancestryData.name}</h3>
            </div>
            <Traits rarity={ancestryData.rarity} traits={ancestryData.traits} />
            <div class="column ancestry-features">
                <FeatureCard id="hp" label="hit points">
                    <span>{ancestryData.hp.toString()}</span>
                </FeatureCard>
                <FeatureCard id="size" label="size">
                    <span>{ancestryData.size.toString()}</span>
                </FeatureCard>
                <FeatureCard id="speed" label="speed">
                    <span>{ancestryData.speed.walk}ft</span>
                    {#if ancestryData.speed.swim}
                        <span>{ancestryData.speed.walk}ft (Swim)</span>
                    {/if}
                </FeatureCard>
                <FeatureCard id="baf" label="boosts & flaws">
                    {#if ancestryData.boosts}
                        {#each ancestryData.boosts as boost}
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
                <FeatureCard id="l" label="languages">
                    <span
                        >{ancestryData.languages.value
                            .map(capitalize)
                            .join(", ")}</span
                    >
                </FeatureCard>
                <FeatureCard id="al" label="additional languages">
                    <span
                        >{ancestryData.additionalLanguages.value
                            .map(capitalize)
                            .join(", ")}</span
                    >
                </FeatureCard>
            </div>
            <p class="description column">
                {@html linkToLinkPreviewConverter(
                    transformDescription(ancestryData.description.summary),
                )}
            </p>
            <p class="disclaimer fancy">
                Boosts & Flaws are selected in the "Finish" step
            </p>

            {#if heritageDecision}
                <DecisionCard
                    from={ancestryData.name}
                    label="Heritage"
                    decision={heritageDecision}
                    bind:value={characterState.heritageDecisions}
                    bind:allDecisionsMade={heritageDecisionsMade}
                />
            {/if}

            {#each ancestryDecision as decision, i}
                {#if Object.entries(characterState.ancestryDecisions).length !== 0}
                    <DecisionCard
                        from={ancestryData.name}
                        label={decision.label}
                        {decision}
                        bind:value={
                            characterState.ancestryDecisions[decision.slug]
                        }
                        bind:allDecisionsMade={ancestryDecisionsMade[i]}
                    />
                {/if}
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

    .ancestry-features {
        width: 100%;
        gap: 0.125rem;
        border-radius: 0.5rem;
        display: grid;
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
