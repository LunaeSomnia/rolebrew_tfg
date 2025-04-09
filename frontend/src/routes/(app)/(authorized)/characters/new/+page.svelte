<script lang="ts">
    import {
        CharacterCreatorStep,
        CharacterState,
        createAncestryDecisionTrees,
        createAncestryHeritageDecisionTree,
        createBackgroundDecisionTrees,
        createClassFeatureDecisionTrees,
        type Choice,
        type DecisionTree,
    } from "$lib/components/character-creator/characterCreator.svelte.js";
    import Button from "$lib/components/Button.svelte";
    import InputField from "$lib/components/InputField.svelte";
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

    let { data } = $props();

    let step: number = $state(CharacterCreatorStep.Init);

    const levels = Array.from(
        Array(20)
            .keys()
            .map((v) => v + 1),
    );

    const abilityScoreMethods = [
        AbilityScoreMethod.Standard,
        AbilityScoreMethod.Classic,
        AbilityScoreMethod.Heroic,
        AbilityScoreMethod.DicePool,
    ];

    //

    let searchbox = $state("");

    //

    let characterState = new CharacterState();
    let characterLevel = $state("");

    let attributeScoreCreationAllChosen = $state(false);

    let ancestryDecisionsMade = $state<boolean[]>([false]);
    let heritageDecisionsMade = $state<boolean>(false);
    let ancestryBoosts = writable<BoostOrFlaw[]>([]);
    let ancestryFlaws = writable<BoostOrFlaw[]>([]);

    let backgroundDecisionsMade = $state<boolean[]>([]);
    let backgroundBoosts = writable<BoostOrFlaw[]>([]);

    let classDecisionsMade = $state<Record<string, boolean[]>>({});
    // let classBoosts = $state<BoostOrFlaw[]>([]);

    //

    let ancestrySummaries = $derived(
        data.ancestrySummaries.filter((v) =>
            v.name.toLocaleLowerCase().includes(searchbox),
        ),
    );
    let selectedAncestrySummary = $derived(
        ancestrySummaries.find((v) => v.slug === characterState.ancestry),
    );

    let backgroundSummaries = $derived(
        data.backgroundSummaries.filter((v) =>
            v.name.toLocaleLowerCase().includes(searchbox),
        ),
    );
    let selectedBackgroundSummary = $derived(
        backgroundSummaries.find((v) => v.slug === characterState.background),
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
        meta: `${selectedAncestrySummary?.name}`,
    } as Step);
    let backgroundStep = $derived({
        label: CharacterCreatorStep[CharacterCreatorStep.Background],
        meta: `${selectedBackgroundSummary?.name}`,
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

    function handleAncestry(ancestry: Ancestry) {
        ancestryBoosts.set([...(ancestry.boosts ?? [])]);
        ancestryFlaws.set([...(ancestry.flaws ?? [])]);
    }

    function handleBackground(background: Background) {
        backgroundBoosts.set([...(background.boosts ?? [])]);
    }

    function handleClass(classData: Class) {
        // classBoosts = classData. ?? [];
    }

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
                    heritageDecisionsMade &&
                    ancestryDecisionsMade.filter((v) => v).length ===
                        ancestryDecisionsMade.length
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
        console.log(characterState, requestBody);
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

        console.log(newCharacterRequest);
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

    // Ancestry Step

    function onSelectAncestry(ancestrySlug: string) {
        characterState.ancestry = ancestrySlug;
        characterState.heritageDecisions = [];
        heritageDecisionsMade = false;
    }

    async function handleAncestryDecisionTree(
        promise: Promise<DecisionTree[]>,
    ): Promise<DecisionTree[]> {
        const decisionTree = await promise;

        ancestryDecisionsMade = new Array(decisionTree.length);
        for (let i = 0; i < decisionTree.length; i++) {
            const tree = decisionTree[i];
            ancestryDecisionsMade[i] = tree.choices.length === 0;
        }

        return decisionTree;
    }

    // Background Step

    function onSelectBackground(backgroundSlug: string) {
        characterState.background = backgroundSlug;
    }

    async function handleBackgroundDecisionTree(
        promise: Promise<DecisionTree[]>,
    ): Promise<DecisionTree[]> {
        const decisionTree = await promise;

        characterState.backgroundDecisions = {};
        backgroundDecisionsMade = new Array(decisionTree.length);
        for (let i = 0; i < decisionTree.length; i++) {
            const tree = decisionTree[i];
            characterState.backgroundDecisions[tree.label] = [];
            backgroundDecisionsMade[i] = tree.choices.length === 0;
        }

        return decisionTree;
    }

    // Class Step

    function onSelectClass(backgroundSlug: string) {
        characterState.class = backgroundSlug;
        characterState.classDecisions = {};
    }

    async function handleClassDecisionTree(
        features: Feat,
        promise: Promise<DecisionTree[]>,
    ): Promise<DecisionTree[]> {
        const decisionTree = await promise;

        characterState.classDecisions[features.name] = {};
        classDecisionsMade[features.name] = new Array(decisionTree.length);
        for (let j = 0; j < decisionTree.length; j++) {
            const tree = decisionTree[j];
            characterState.classDecisions[features.name][tree.label] = [];
            classDecisionsMade[features.name][j] = tree.choices.length === 0;
        }

        return decisionTree;
    }

    //
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
                        <InputField
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
            {@render list(
                ancestrySummaries,
                characterState.ancestry,
                onSelectAncestry,
            )}
            <div class="column card">
                <div class="column wrapper">
                    {#if characterState.ancestry}
                        {#await fetch("/api/ancestry/" + characterState.ancestry).then( (v) => v.json(), ) then ancestry: Ancestry}
                            {handleAncestry(ancestry)}
                            <div class="header row">
                                <h3>{ancestry.name}</h3>
                            </div>
                            <Traits
                                rarity={ancestry.rarity}
                                traits={ancestry.traits}
                            />
                            <div class="column ancestry-features">
                                <FeatureCard id="hp" label="hit points">
                                    <span>{ancestry.hp.toString()}</span>
                                </FeatureCard>
                                <FeatureCard id="size" label="size">
                                    <span>{ancestry.size.toString()}</span>
                                </FeatureCard>
                                <FeatureCard id="speed" label="speed">
                                    <span>{ancestry.speed.walk}ft</span>
                                    {#if ancestry.speed.swim}
                                        <span
                                            >{ancestry.speed.walk}ft (Swim)</span
                                        >
                                    {/if}
                                </FeatureCard>
                                <FeatureCard id="baf" label="boosts & flaws">
                                    {#if ancestry.boosts}
                                        {#each ancestry.boosts as boost}
                                            {#if boost.type === "free"}
                                                <span>Free Ability Boost</span>
                                            {:else if boost.type === "grant"}
                                                <span>{boost.att}</span>
                                            {:else if boost.type === "choose"}
                                                <span
                                                    >{boost.atts.join(
                                                        " or ",
                                                    )}</span
                                                >
                                            {/if}
                                        {/each}
                                    {/if}
                                </FeatureCard>
                                <FeatureCard id="l" label="languages">
                                    <span
                                        >{ancestry.languages.value.join(
                                            ", ",
                                        )}</span
                                    >
                                </FeatureCard>
                                <FeatureCard
                                    id="al"
                                    label="additional languages"
                                >
                                    <span
                                        >{ancestry.additionalLanguages.value.join(
                                            ", ",
                                        )}</span
                                    >
                                </FeatureCard>
                            </div>
                            <p class="description column">
                                {@html linkToLinkPreviewConverter(
                                    transformDescription(
                                        ancestry.description.summary,
                                    ),
                                )}
                            </p>
                            <p class="disclaimer fancy">
                                Boosts & Flaws are selected in the "Finish" step
                            </p>

                            {#await handleAncestryDecisionTree(createAncestryDecisionTrees(ancestry)) then selectDecisionTree}
                                {#each selectDecisionTree as decision, i}
                                    <DecisionCard
                                        from={ancestry.name}
                                        label={decision.label}
                                        {decision}
                                        bind:value={
                                            characterState.ancestryDecisions[
                                                decision.label
                                            ]
                                        }
                                        bind:allDecisionsMade={
                                            ancestryDecisionsMade[i]
                                        }
                                    />
                                {/each}
                            {/await}

                            {#await createAncestryHeritageDecisionTree(ancestry) then selectDecisionTree}
                                <DecisionCard
                                    from={ancestry.name}
                                    label="Heritage"
                                    decision={selectDecisionTree}
                                    bind:value={
                                        characterState.heritageDecisions
                                    }
                                    bind:allDecisionsMade={
                                        heritageDecisionsMade
                                    }
                                />
                            {/await}
                        {/await}
                    {:else}
                        <div class="not-selected">
                            <p>Select an Ancestry to continue</p>
                        </div>
                    {/if}
                </div>
            </div>
        {:else if step === CharacterCreatorStep.Background}
            {@render list(
                backgroundSummaries,
                characterState.background,
                onSelectBackground,
            )}
            <div class="column card">
                <div class="column wrapper">
                    {#if characterState.background}
                        {#await fetch("/api/background/" + characterState.background).then( (v) => v.json(), ) then background: Background}
                            {handleBackground(background)}
                            <div class="header row">
                                <h3>{background.name}</h3>
                            </div>
                            <Traits
                                rarity={background.rarity}
                                traits={background.traits}
                            />
                            <div class="column background-features">
                                <FeatureCard id="boosts" label="boosts">
                                    {#if background.boosts}
                                        {#each background.boosts as boost}
                                            {#if boost.type === "free"}
                                                <span>Free Ability Boost</span>
                                            {:else if boost.type === "grant"}
                                                <span>{boost.att}</span>
                                            {:else if boost.type === "choose"}
                                                <span
                                                    >{boost.atts.join(
                                                        " or ",
                                                    )}</span
                                                >
                                            {/if}
                                        {/each}
                                    {/if}
                                </FeatureCard>
                                <FeatureCard id="skills" label="skills">
                                    {#each background.trainedSkills.value ?? [] as skill}
                                        <ProficiencyLabel
                                            proficiency="Trained"
                                            label={skill}
                                        />
                                    {/each}
                                    {#each background.trainedSkills.lore ?? [] as skill}
                                        <ProficiencyLabel
                                            proficiency="Trained"
                                            label={skill}
                                        />
                                    {/each}
                                </FeatureCard>
                            </div>
                            <div
                                class="row gained-features"
                                style="flex-wrap: wrap;"
                            >
                                {#each background.features ?? [] as feature}
                                    <FeatureLink
                                        name={feature.name}
                                        level={feature.level}
                                        href="/compendium/feat/{feature.slug}"
                                    />
                                {/each}
                            </div>
                            <p class="description column">
                                {@html linkToLinkPreviewConverter(
                                    transformDescription(
                                        background.description,
                                    ),
                                )}
                            </p>
                            <p class="disclaimer fancy">
                                Boosts are selected in the "Finish" step
                            </p>

                            {#await handleBackgroundDecisionTree(createBackgroundDecisionTrees(background)) then selectDecisionTree}
                                {#each selectDecisionTree as decision, i}
                                    <DecisionCard
                                        from={background.name}
                                        label={decision.label}
                                        {decision}
                                        bind:value={
                                            characterState.backgroundDecisions[
                                                decision.label
                                            ]
                                        }
                                        bind:allDecisionsMade={
                                            backgroundDecisionsMade[i]
                                        }
                                    />
                                {/each}
                            {/await}
                        {/await}
                    {:else}
                        <div class="not-selected">
                            <p>Select an Ancestry to continue</p>
                        </div>
                    {/if}
                </div>
            </div>
        {:else if step === CharacterCreatorStep.Class}
            {@render list(classSummaries, characterState.class, onSelectClass)}
            <div class="column card">
                <div class="column wrapper">
                    {#if characterState.class}
                        {#await fetch("/api/class/" + characterState.class).then( (v) => v.json(), ) then classData: Class}
                            {handleClass(classData)}
                            {@const classFeatures = (
                                classData.features ?? []
                            ).filter((v) => v.level <= characterState.level)}
                            <div class="header row">
                                <h3>{classData.name}</h3>
                            </div>
                            <Traits
                                rarity={classData.rarity}
                                traits={classData.traits}
                            />
                            <div class="column class-features">
                                <FeatureCard id="ka" label="key ability">
                                    {#if classData.keyAbility === undefined || classData.keyAbility?.length === 0}
                                        <span>None</span>
                                    {:else}
                                        <span
                                            >{classData.keyAbility.join(
                                                ", ",
                                            )}</span
                                        >
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
                                            proficiency={classData.attacks.other
                                                .rank}
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
                                        <ProficiencyLabel
                                            proficiency="Trained"
                                            label="Light"
                                        />
                                    {/if}
                                    {#if classData.defenses.medium}
                                        <ProficiencyLabel
                                            proficiency="Trained"
                                            label="Medium"
                                        />
                                    {/if}
                                    {#if classData.defenses.heavy}
                                        <ProficiencyLabel
                                            proficiency="Trained"
                                            label="Heavy"
                                        />
                                    {/if}
                                </FeatureCard>
                                <FeatureCard id="st" label="saving throws">
                                    <ProficiencyLabel
                                        proficiency={classData.savingThrows
                                            .fortitude}
                                        label="Fortitude"
                                    />
                                    <ProficiencyLabel
                                        proficiency={classData.savingThrows
                                            .reflex}
                                        label="Reflex"
                                    />
                                    <ProficiencyLabel
                                        proficiency={classData.savingThrows
                                            .will}
                                        label="Will"
                                    />
                                </FeatureCard>
                                <FeatureCard id="sk" label="skills">
                                    {#each classData.trainedSkills.value as skill}
                                        <ProficiencyLabel
                                            proficiency="Trained"
                                            label={skill}
                                        />
                                    {/each}
                                    <span
                                        >Additional skills equal to {classData
                                            .trainedSkills.additional} + your {classData.keyAbility}
                                        modifier.</span
                                    >
                                </FeatureCard>
                            </div>
                            <div
                                class="row gained-features"
                                style="flex-wrap: wrap;"
                            >
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

                            {#each classFeatures as feature}
                                {#await handleClassDecisionTree(feature, createClassFeatureDecisionTrees(feature)) then selectDecisionTree}
                                    {#each selectDecisionTree as decision, j}
                                        <DecisionCard
                                            from={feature.name}
                                            label={decision.label}
                                            {decision}
                                            bind:value={
                                                characterState.classDecisions[
                                                    feature.name
                                                ][decision.label]
                                            }
                                            bind:allDecisionsMade={
                                                classDecisionsMade[
                                                    feature.name
                                                ][j]
                                            }
                                        />
                                    {/each}
                                {/await}
                            {/each}
                        {/await}
                    {:else}
                        <div class="not-selected">
                            <p>Select an Ancestry to continue</p>
                        </div>
                    {/if}
                </div>
            </div>
        {:else if step === CharacterCreatorStep.Finishing}
            <div class="row finishing">
                <div class="card column summary">
                    <div class="general-info column">
                        <span class="name">{characterState.name}</span>
                        <span class="level">{characterLevel}</span>
                    </div>
                    {$inspect(
                        "ancestryDecisions",
                        characterState.ancestryDecisions,
                    )}
                    {$inspect(
                        "heritageDecisions",
                        characterState.heritageDecisions,
                    )}
                    {$inspect(
                        "backgroundDecisions",
                        characterState.backgroundDecisions,
                    )}
                    {$inspect("selectedClassSummary", selectedClassSummary)}
                    <div class="column">
                        <span class="tag">Ancestry</span>
                        <span>{selectedAncestrySummary?.name}</span>
                        <div class="column decision-group">
                            <span>
                                {characterState.heritageDecisions.length > 0
                                    ? characterState.heritageDecisions[0].label
                                    : ""}
                            </span>
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
                        <span>{selectedBackgroundSummary?.name}</span>
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
                        <span>{selectedClassSummary?.name}</span>
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
                        {console.log($ancestryBoosts, $backgroundBoosts)}
                        <div class="column boost">
                            <div class="row" style="align-items: baseline;">
                                <h4 style="width: auto;">Ancestry Boosts</h4>
                                <span>from {selectedAncestrySummary?.name}</span
                                >
                            </div>
                            {#each $ancestryBoosts as boost, i}
                                <AttributeSelector
                                    boostOrFlaw={boost}
                                    value={characterState.ancestryBoosts[i]}
                                />
                            {/each}
                        </div>
                        <div class="column boost">
                            <div class="row" style="align-items: baseline;">
                                <h4 style="width: auto;">Background Boosts</h4>
                                <span
                                    >from {selectedBackgroundSummary?.name}</span
                                >
                            </div>
                            {#each $backgroundBoosts as boost, i}
                                <AttributeSelector
                                    boostOrFlaw={boost}
                                    value={characterState.ancestryBoosts[i]}
                                />
                            {/each}
                        </div>
                        <div class="column boost">
                            <div class="row" style="align-items: baseline;">
                                <h4 style="width: auto;">Class Boosts</h4>
                                <span>from {selectedClassSummary?.name}</span>
                            </div>
                        </div>
                    </div>
                    <div class="card column flaws">
                        <h4>Flaws</h4>
                    </div>
                </div>
                <Skills
                    level={characterState.level}
                    skills={characterState.skills}
                    additionalSkills={characterState.additionalSkills}
                    attributeScores={characterState.attributeScores}
                />
                <div class="column attributes">
                    <AttributeValue
                        attribute="Strength"
                        value={characterState.attributeScores.Strength}
                    />
                    <AttributeValue
                        attribute="Dexterity"
                        value={characterState.attributeScores.Dexterity}
                    />
                    <AttributeValue
                        attribute="Constitution"
                        value={characterState.attributeScores.Constitution}
                    />
                    <AttributeValue
                        attribute="Intelligence"
                        value={characterState.attributeScores.Intelligence}
                    />
                    <AttributeValue
                        attribute="Wisdom"
                        value={characterState.attributeScores.Wisdom}
                    />
                    <AttributeValue
                        attribute="Charisma"
                        value={characterState.attributeScores.Charisma}
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
