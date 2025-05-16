<script lang="ts">
    import { CharacterSimulationState } from "$lib/characterSimulator.svelte.js";
    import ArmorClass from "$lib/components/character-simulator/ArmorClass.svelte";
    import AttributesCard from "$lib/components/character-simulator/AttributesCard.svelte";
    import HeroPoints from "$lib/components/character-simulator/HeroPoints.svelte";
    import HpCard from "$lib/components/character-simulator/HPCard.svelte";
    import Initiative from "$lib/components/character-simulator/Initiative.svelte";
    import Stat from "$lib/components/character-simulator/Stat.svelte";
    import Skills from "$lib/components/character-simulator/Skills.svelte";
    import ToggleButton from "$lib/components/ToggleButton.svelte";
    import { Icon } from "$lib/icons/icons.js";
    import { capitalize } from "$lib/utils.js";
    import SavingThrows from "$lib/components/character-simulator/SavingThrows.svelte";
    import Chat from "$lib/components/character-simulator/chat/Chat.svelte";
    import Button from "$lib/components/Button.svelte";
    import EquipmentPage from "$lib/components/character-simulator/pages/equipment/EquipmentPage.svelte";
    import ActionsPage from "$lib/components/character-simulator/pages/actions/ActionsPage.svelte";
    import SpellsPage from "$lib/components/character-simulator/pages/spells/SpellsPage.svelte";
    import ConditionsPage from "$lib/components/character-simulator/pages/conditions/ConditionsPage.svelte";
    import InfoPage from "$lib/components/character-simulator/pages/InfoPage.svelte";
    import type { PageProps } from "./$types";
    import Tag from "$lib/components/Tag.svelte";
    import FeaturesPage from "$lib/components/character-simulator/pages/features/FeaturesPage.svelte";

    let { data }: PageProps = $props();

    let isChatOpen = $state(true);
    let mainPage = $state(0);

    //

    let simulationState: CharacterSimulationState = $state(
        data.simulationState,
    );
    let character = $derived(simulationState.character);

    let headerSubtitle = $derived(
        `${capitalize(character.ancestry)} ${capitalize(character.class)}, ${character.level}`,
    );

    let activeConditions = $derived(
        simulationState.items.conditions.filter((v) => v.isActive),
    );

    async function saveCharacterState() {
        // @ts-ignore
        const characterId = character._id.$oid;
        const body = JSON.stringify(simulationState.toJSON());
        const request = await fetch(
            `/api/user/${data.user.username}/character/${characterId}`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body,
            },
        );
    }

    $effect(() => {
        $inspect(simulationState.activeRules);
    });
</script>

<div class="column character" class:chat-open={isChatOpen}>
    <div class="card row header spaced-between">
        <div class="row info">
            <h4 class="name">{character.name}</h4>
            <span class="name">{headerSubtitle}</span>
            {#if activeConditions.length > 0}
                <Tag>
                    {activeConditions.length} conditions active
                </Tag>
            {/if}
        </div>
        <div class="row" style="align-items: center;">
            <div class="row hero-points">
                <span>Hero Points</span>
                <HeroPoints
                    bind:value={simulationState.items.heroPoints.value}
                />
            </div>
            <ToggleButton iconLeft={Icon.Chat} bind:value={isChatOpen} />
            <Button cta="secondary" onclick={saveCharacterState}>Save</Button>
        </div>
    </div>

    <div class="row wrapper">
        <HpCard
            {simulationState}
            bind:currentHp={simulationState.items.hp.value}
            bind:tempHp={simulationState.items.tempHp.value}
            totalHp={character.hp}
        />

        <AttributesCard
            {simulationState}
            attributes={character.attributeModifiers}
        />

        <div class="card row other">
            <!-- <Stat
                        icon={Icon.Size}
                        text={character.size}
                        tooltip="Size"
                    /> -->
            <Stat
                icon={Icon.Speed}
                text={character.speed.walk + " feet"}
                tooltip="Speed"
            />
            <!-- <Stat
                        icon={Icon.Eye}
                        text={capitalize(character.vision)}
                        tooltip="Perception"
                    /> -->
        </div>
    </div>

    <div class="row" style="width: 100%;">
        <div class="column">
            <ArmorClass
                state={simulationState}
                bind:value={simulationState.armorClass}
                bind:armorChosen={simulationState.currentArmor}
                bind:hasShieldUp={simulationState.hasShieldUp}
                shieldChoices={[]}
                bind:shieldChosen={simulationState.currentShield}
            />
            <Initiative
                state={simulationState}
                bind:value={simulationState.initiative}
            />
            <Skills
                {simulationState}
                level={character.level}
                skills={simulationState.items.skills}
                additionalSkills={character.additionalSkills}
                attributeModifiers={character.attributeModifiers}
            />
            <SavingThrows
                {simulationState}
                keyAbility={character.keyAbility[0]}
                savingThrows={character.savingThrows}
                attributeModifiers={character.attributeModifiers}
                level={character.level}
            />
        </div>
        <div class="main-wrapper column">
            <div class="pages-wrapper row">
                <Button
                    cta={mainPage === 0 ? "primary" : "secondary"}
                    onclick={() => (mainPage = 0)}>Actions</Button
                >
                <Button
                    cta={mainPage === 1 ? "primary" : "secondary"}
                    onclick={() => (mainPage = 1)}>Equipment</Button
                >
                {#if simulationState.character.spellcasting}
                    <Button
                        cta={mainPage === 2 ? "primary" : "secondary"}
                        onclick={() => (mainPage = 2)}>Spells</Button
                    >
                {/if}
                <Button
                    cta={mainPage === 3 ? "primary" : "secondary"}
                    onclick={() => (mainPage = 3)}>Conditions</Button
                >
                <Button
                    cta={mainPage === 4 ? "primary" : "secondary"}
                    onclick={() => (mainPage = 4)}>Features</Button
                >
                <Button
                    cta={mainPage === 5 ? "primary" : "secondary"}
                    onclick={() => (mainPage = 5)}>Info</Button
                >
            </div>
            {#if mainPage === 0}
                <ActionsPage actions={data.actions} {simulationState} />
            {:else if mainPage === 1}
                <EquipmentPage
                    equipmentSummaries={data.equipmentSummaries}
                    {simulationState}
                />
            {:else if mainPage === 2}
                <SpellsPage
                    {simulationState}
                    spells={data.spells}
                    classData={data.classData}
                />
            {:else if mainPage === 3}
                <ConditionsPage bind:simulationState />
            {:else if mainPage === 5}
                <InfoPage {simulationState} />
            {:else if mainPage === 4}
                <FeaturesPage {simulationState} />
            {/if}
        </div>
    </div>
</div>

{#if isChatOpen}
    <Chat {simulationState} />
{/if}

<style lang="scss">
    :global(.character .card) {
        padding: 1rem;
        min-height: 4.5rem;
    }

    .wrapper {
        width: 100%;
    }

    .character {
        position: relative;
        width: 100%;

        .header {
            width: 100%;
            align-items: center;

            .info {
                align-items: baseline;
                text-wrap: nowrap;
            }
        }

        &.chat-open {
            width: calc(100% - 20rem - 1rem);
        }
    }

    .other {
        padding-left: 1.5rem;
        align-items: center;
    }

    .hero-points {
        align-items: center;
    }

    .main-wrapper {
        width: 100%;
        height: 100%;
        flex: 1;
    }
</style>
