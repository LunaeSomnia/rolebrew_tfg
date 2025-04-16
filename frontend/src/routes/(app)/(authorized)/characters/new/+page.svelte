<script lang="ts">
    import {
        CharacterCreatorStep,
        CharacterState,
        createAncestryDecisionTrees,
        createAncestryHeritageDecisionTree,
        createBackgroundDecisionTrees,
        createFeatureDecisionTrees,
        type Choice,
        type DecisionTree,
    } from "$lib/components/character-creator/characterCreator.svelte.js";
    import Button from "$lib/components/Button.svelte";
    import Input from "$lib/components/Input.svelte";
    import Select from "$lib/components/Select.svelte";
    import Stepper from "$lib/components/stepper/Stepper.svelte";
    import type { Step } from "$lib/components/stepper/stepper";
    import { Icon } from "$lib/icons/icons";
    import IconSvg from "$lib/icons/IconSVG.svelte";
    import Searchbox from "$lib/components/Searchbox.svelte";
    import type {
        Ancestry,
        Background,
        Summary,
        Class,
        Feat,
        Attribute,
        BoostOrFlaw,
    } from "$lib/bindings";
    import ListItem from "$lib/components/character-creator/ListItem.svelte";
    import { goto } from "$app/navigation";
    import {
        linkToLinkPreviewConverter,
        transformDescription,
    } from "$lib/textProcessing";
    import FeatureCard from "$lib/components/character-creator/FeatureCard.svelte";
    import Traits from "$lib/components/Traits.svelte";
    import DecisionCard from "$lib/components/character-creator/DecisionCard.svelte";
    import ProficiencyLabel from "$lib/blocks/ProficiencyLabel.svelte";
    import FeatureLink from "$lib/components/character-creator/FeatureLink.svelte";
    import {
        AbilityScoreMethod,
        rollAbilityScores,
        type Roll,
        type RollResult,
    } from "$lib/components/character-creator/abilityScoreCreation.js";
    import { roll } from "$lib/roll";
    import DiceRoll from "$lib/components/character-creator/DiceRoll.svelte";
    import AttributeScoreCreation from "$lib/components/character-creator/AttributeScoreCreation.svelte";
    import AttributeValue from "$lib/components/AttributeValue.svelte";
    import Skills from "$lib/components/Skills.svelte";
    import { writable } from "svelte/store";
    import AttributeSelector from "$lib/components/character-creator/AttributeSelector.svelte";
    import { capitalize } from "$lib/utils.js";
    import AncestryPage from "$lib/components/character-creator/pages/AncestryPage.svelte";
    import BackgroundPage from "$lib/components/character-creator/pages/BackgroundPage.svelte";
    import ClassPage from "$lib/components/character-creator/pages/ClassPage.svelte";
    import SkillSelector from "$lib/components/character-creator/SkillSelector.svelte";

    let { data } = $props();

    let step: number = $state(CharacterCreatorStep.Init);

    const levels = Array.from(
        Array(20)
            .keys()
            .map((v) => v + 1),
    );

    //

    let searchbox = $state("");

    //

    let characterState = $state(new CharacterState());
    let characterLevel = $state("");

    let attributeScoreCreationAllChosen = $state(false);

    let ancestryDecisionsMade = $state<boolean[]>([false]);
    let heritageDecisionsMade = $state<boolean>(false);
    let ancestryBoosts = $state<BoostOrFlaw[]>([]);
    let ancestryFlaws = $state<BoostOrFlaw[]>([]);

    let backgroundDecisionsMade = $state<boolean[]>([]);
    let backgroundBoosts = $state<BoostOrFlaw[]>([]);

    let classDecisionsMade = $state<Record<string, boolean[]>>({});
    let classBoosts = $state<BoostOrFlaw[]>([]);
    let keyAbilityChosen = $state<boolean>(false);

    //

    let ancestrySummaries = $derived(
        data.ancestrySummaries.filter((v) =>
            v.name.toLocaleLowerCase().includes(searchbox),
        ),
    );

    let backgroundSummaries = $derived(
        data.backgroundSummaries.filter((v) =>
            v.name.toLocaleLowerCase().includes(searchbox),
        ),
    );

    let classSummaries = $derived(
        data.classSummaries.filter((v) =>
            v.name.toLocaleLowerCase().includes(searchbox),
        ),
    );
    let selectedClassSummary = $derived(
        classSummaries.find((v) => v.slug === characterState.class),
    );

    //

    let initStep = $derived({
        label: CharacterCreatorStep[CharacterCreatorStep.Init],
        meta: `${characterState.name}, ${characterState.level}`,
    } as Step);
    let ancestryStep = $derived({
        label: CharacterCreatorStep[CharacterCreatorStep.Ancestry],
        meta: `${capitalize(characterState.ancestry)}`,
    } as Step);
    let backgroundStep = $derived({
        label: CharacterCreatorStep[CharacterCreatorStep.Background],
        meta: `${capitalize(characterState.background)}`,
    } as Step);
    let classStep = $derived({
        label: CharacterCreatorStep[CharacterCreatorStep.Class],
        meta: `${selectedClassSummary?.name}`,
    } as Step);
    let finishingStep = $derived({
        label: CharacterCreatorStep[CharacterCreatorStep.Finishing],
        meta: "",
    } as Step);
    let steps = $derived([
        initStep,
        ancestryStep,
        backgroundStep,
        classStep,
        finishingStep,
    ]);

    //

    $effect(() => {
        characterState.level = Number.parseInt(characterLevel);
    });

    //

    let canContinue: boolean = $derived.by(() => {
        switch (step) {
            case CharacterCreatorStep.Init:
                return (
                    characterState.name !== "" &&
                    characterState.level > 0 &&
                    characterState.level <= 20 &&
                    attributeScoreCreationAllChosen
                );
            case CharacterCreatorStep.Ancestry:
                return (
                    characterState.ancestry !== "" &&
                    ancestryDecisionsMade.filter((v) => v).length ===
                        ancestryDecisionsMade.length &&
                    heritageDecisionsMade
                );
            case CharacterCreatorStep.Background:
                return (
                    characterState.background !== "" &&
                    backgroundDecisionsMade.filter((v) => v).length ===
                        backgroundDecisionsMade.length
                );
            case CharacterCreatorStep.Class:
                return (
                    characterState.class !== undefined &&
                    allDecisionsMade(Object.values(classDecisionsMade))
                );
            case CharacterCreatorStep.Finishing:
                return true;
            default:
                return false;
        }
    });

    function stepToHeader(): string {
        switch (step) {
            case CharacterCreatorStep.Init:
                return "Fill the basic information";
            case CharacterCreatorStep.Ancestry:
                return "Select an Ancestry";
            case CharacterCreatorStep.Background:
                return "Select a Background";
            case CharacterCreatorStep.Class:
                return "Select a Class";
            case CharacterCreatorStep.Finishing:
                return "Finishing Steps";
            default:
                return "TODO";
        }
    }

    function onClickBack() {
        step -= 1;
        if (step === -1) {
            goto("/characters");
        }
        searchbox = "";
    }

    function onContinue() {
        step += 1;
        searchbox = "";
    }

    async function onFinish() {
        const requestBody = JSON.stringify(characterState.toJSON());
        const newCharacterRequest = await fetch(
            `/api/user/${data.user.username}/new_character`,
            {
                method: "POST",
                body: requestBody,
                headers: {
                    "Content-Type": "application/json",
                },
            },
        );

        if (newCharacterRequest.ok) {
            goto("/characters/");
        }
    }

    function allDecisionsMade(v: any[]): boolean {
        let final = true;
        for (let i = 0; i < v.length; i++) {
            const element = v[i];
            if (element) {
                if (typeof element === "object" && "length" in element) {
                    final &&= allDecisionsMade(element);
                } else {
                    final &&= element;
                }
            }
        }
        return final;
    }
</script>

{#snippet list(
    summaries: Summary[],
    selectedSummary: string | undefined,
    selectFn: (slug: string) => void,
)}
    <div class="column card">
        <div class="column wrapper">
            <div class="row card-header">
                <Searchbox bind:value={searchbox} placeholder="Search" />
            </div>
            <div class="column card-content">
                {#each summaries as summary}
                    <ListItem
                        {summary}
                        selected={selectedSummary === summary.slug}
                        onclick={() => {
                            selectFn(summary.slug);
                        }}
                    />
                {/each}
            </div>
        </div>
    </div>
{/snippet}

<div class="character-creator column">
    <div class="header row spaced-between">
        <Button cta="secondary" class="back-button" onclick={onClickBack}>
            <IconSvg icon={Icon.ChevronLeft} fill="var(--light-3)" />
        </Button>

        <h1>{stepToHeader()}</h1>

        {#if step === CharacterCreatorStep.Finishing}
            <Button onclick={onFinish} disabled={!canContinue}>Finish</Button>
        {:else}
            <Button onclick={onContinue} disabled={!canContinue}
                >Continue</Button
            >
        {/if}
    </div>
    <div class="wrapper row">
        {#if step === CharacterCreatorStep.Init}
            <div class="card column" style="gap: 2rem;">
                <h4>Character Information</h4>
                <div class="row">
                    <div class="column input-group character-name">
                        <span class="tag small">Name</span>
                        <Input
                            bind:value={characterState.name}
                            placeholder="Character Name"
                            type="text"
                        />
                    </div>
                    <div class="column input-group level">
                        <span class="tag small">Level</span>
                        <Select
                            bind:value={characterLevel}
                            choices={levels.map((v) => {
                                return {
                                    value: v.toString(),
                                    label: v.toString(),
                                };
                            })}
                            placeholder="Level"
                        />
                    </div>
                </div>
                <AttributeScoreCreation
                    bind:allChosen={attributeScoreCreationAllChosen}
                    bind:value={characterState.attributeScores}
                />
            </div>
            <div class="card column"></div>
        {:else if step === CharacterCreatorStep.Ancestry}
            <AncestryPage
                {list}
                bind:characterState
                bind:ancestrySummaries
                bind:ancestryBoosts
                bind:ancestryFlaws
                bind:ancestryDecisionsMade
                bind:heritageDecisionsMade
            />
        {:else if step === CharacterCreatorStep.Background}
            <BackgroundPage
                {list}
                bind:characterState
                bind:backgroundSummaries
                bind:backgroundBoosts
                bind:backgroundDecisionsMade
            />
        {:else if step === CharacterCreatorStep.Class}
            <ClassPage
                {list}
                bind:keyAbilityChosen
                bind:characterState
                bind:classSummaries
                bind:classBoosts
                bind:classDecisionsMade
            />
        {:else if step === CharacterCreatorStep.Finishing}
            {@const ancestryName = capitalize(characterState.ancestry)}
            {@const heritageName = capitalize(
                characterState.heritageDecisions.length > 0
                    ? characterState.heritageDecisions[0].label
                    : "",
            )}
            {@const backgroundName = capitalize(characterState.background)}
            {@const className = capitalize(characterState.class)}
            <div class="row finishing">
                <div class="card column summary">
                    <div class="general-info column">
                        <span class="name">{characterState.name}</span>
                        <span class="level">{characterState.level}</span>
                    </div>

                    <div class="column">
                        <span class="tag">Ancestry</span>
                        <span>{ancestryName}</span>
                        <div class="column decision-group">
                            <span>{heritageName}</span>
                            {#if characterState.heritageDecisions.length > 1}
                                <ul>
                                    {#each characterState.heritageDecisions.slice(1) as value}
                                        <li>{value.label}</li>
                                    {/each}
                                </ul>
                            {/if}
                        </div>
                    </div>

                    <div class="column">
                        <span class="tag">Background</span>
                        <span>{backgroundName}</span>
                        {#each Object.entries(characterState.backgroundDecisions) as [decision, value]}
                            {#if value.length > 0}
                                <div class="column" style="margin-left: 1rem;">
                                    <span class="tag">{decision}</span>
                                    <span>{value[0].label}</span>
                                    <ul>
                                        {#if value.length > 1}
                                            {#each value.slice(1) as choice}
                                                <li>{choice.label}</li>
                                            {/each}
                                        {/if}
                                    </ul>
                                </div>
                            {/if}
                        {/each}
                    </div>
                    <div class="column">
                        <span class="tag">Class</span>
                        <span>{className}</span>
                        {#each Object.entries(characterState.classDecisions) as [feat, featDecision]}
                            {#each Object.entries(featDecision) as [decision, value]}
                                <div class="column" style="margin-left: 1rem;">
                                    <span class="tag">{decision}</span>
                                    <span>{value[0].label}</span>
                                    <ul>
                                        {#if value.length > 1}
                                            {#each value.slice(1) as choice}
                                                <li>{choice.label}</li>
                                            {/each}
                                        {/if}
                                    </ul>
                                </div>
                            {/each}
                        {/each}
                    </div>
                </div>

                <div class="column main">
                    <div class="card column boosts">
                        <div class="column boost">
                            <div class="row" style="align-items: baseline;">
                                <h4 style="width: auto;">Ancestry Boosts</h4>
                                <span>from {ancestryName}</span>
                            </div>
                            {#each ancestryBoosts as boost, i}
                                <AttributeSelector
                                    boostOrFlaw={boost}
                                    bind:value={
                                        characterState.ancestryBoosts[i]
                                    }
                                />
                            {/each}
                        </div>
                        <div class="column boost">
                            <div class="row" style="align-items: baseline;">
                                <h4 style="width: auto;">Background Boosts</h4>
                                <span>from {backgroundName}</span>
                            </div>
                            {#each backgroundBoosts as boost, i}
                                <AttributeSelector
                                    boostOrFlaw={boost}
                                    bind:value={
                                        characterState.backgroundBoosts[i]
                                    }
                                />
                            {/each}
                        </div>
                        <!-- <div class="column boost">
                            <div class="row" style="align-items: baseline;">
                                <h4 style="width: auto;">Class Boosts</h4>
                                <span>from {selectedClassSummary?.name}</span>
                            </div>
                        </div> -->
                    </div>
                    <div class="card column skills">
                        <h4 style="width: auto;">Class skills</h4>
                        {#each Array(characterState.trainableSkillsNumber) as _, i}
                            <SkillSelector
                                bind:trainableSkills={
                                    characterState.trainableSkills
                                }
                                bind:value={characterState.skillsChosen[i]}
                            />
                        {/each}
                    </div>
                    <div class="card column flaws">
                        <h4>Flaws</h4>
                    </div>
                </div>
                <Skills
                    level={characterState.level}
                    skills={characterState.skills}
                    additionalSkills={characterState.additionalSkills}
                    attributeModifiers={characterState.attributeModifiers}
                />
                <div class="column attributes">
                    <AttributeValue
                        attribute="Strength"
                        value={characterState.attributeModifiers.Strength}
                        modified={characterState.attributeBoosts["Strength"] !==
                            0}
                    />
                    <AttributeValue
                        attribute="Dexterity"
                        value={characterState.attributeModifiers.Dexterity}
                        modified={characterState.attributeBoosts.Dexterity !==
                            0}
                    />
                    <AttributeValue
                        attribute="Constitution"
                        value={characterState.attributeModifiers.Constitution}
                        modified={characterState.attributeBoosts
                            .Constitution !== 0}
                    />
                    <AttributeValue
                        attribute="Intelligence"
                        value={characterState.attributeModifiers.Intelligence}
                        modified={characterState.attributeBoosts
                            .Intelligence !== 0}
                    />
                    <AttributeValue
                        attribute="Wisdom"
                        value={characterState.attributeModifiers.Wisdom}
                        modified={characterState.attributeBoosts.Wisdom !== 0}
                    />
                    <AttributeValue
                        attribute="Charisma"
                        value={characterState.attributeModifiers.Charisma}
                        modified={characterState.attributeBoosts.Charisma !== 0}
                    />
                </div>
            </div>
        {/if}
    </div>
    <Stepper
        bind:steps
        currentStep={step}
        onclickstep={(i) => {
            // if (i < step) {
            step = i;
            // }
        }}
    />
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

    .character-creator {
        width: 100%;
        height: 0;
        flex-grow: 1;
        gap: 2rem;

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
    }

    .finishing {
        width: 100%;
        align-items: flex-start;

        & > .column {
            gap: 2rem;
        }

        .summary {
            width: 20rem;
        }

        .main {
            flex: 1;
        }

        .attributes {
            width: auto;
            gap: 1rem;
        }

        .decision-group {
            gap: 0.5rem;
        }

        .general-info {
            gap: 0.5rem;

            .name {
                color: var(--light-1);
                font-weight: 500;
            }

            .level {
                color: var(--light-3);
            }
        }

        .boosts {
            width: 100%;
            gap: 2rem;

            .boost {
                width: 100%;
            }
        }
    }
</style>
