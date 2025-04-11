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
    import Chat from "$lib/components/character-simulator/Chat.svelte";

    let { data } = $props();

    let isChatOpen = $state(true);

    //

    let character = $derived(data.character);
    let simulationState = new CharacterSimulationState(data.character);

    let headerSubtitle = $derived(
        `${capitalize(character.ancestry)} ${capitalize(character.class)}, ${character.level}`,
    );
</script>

<div class="column character" class:chat-open={isChatOpen}>
    <div class="card row header spaced-between">
        <div class="row info">
            <h4 class="name">{character.name}</h4>
            <span class="name">{headerSubtitle}</span>
        </div>
        <div class="row" style="align-items: center;">
            <div class="row hero-points">
                <span>Hero Points</span>
                <HeroPoints bind:value={simulationState.heroPoints} />
            </div>
            <ToggleButton iconLeft={Icon.Chat} bind:value={isChatOpen} />
        </div>
    </div>

    <div class="row wrapper">
        <HpCard
            bind:currentHp={simulationState.hp}
            bind:tempHp={simulationState.tempHp}
            totalHp={character.hp}
        />

        <AttributesCard attributes={character.attributeModifiers} />

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

    <div class="row">
        <div class="column">
            <ArmorClass
                bind:value={simulationState.armorClass}
                armorChoices={[{ label: "Unarmored", value: "Unarmored" }]}
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
                skills={character.skills}
                additionalSkills={character.additionalSkills}
                attributeModifiers={character.attributeModifiers}
            />
            <SavingThrows
                keyAbility={character.keyAbility[0]}
                savingThrows={character.savingThrows}
                attributeModifiers={character.attributeModifiers}
                level={character.level}
            />
        </div>
        <div class="main">
            <!-- ACTIONS, EQUIPMENT, SPELLS, CONDITIONS -->
        </div>
    </div>
</div>

<Chat state={simulationState} bind:show={isChatOpen} />

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
</style>
