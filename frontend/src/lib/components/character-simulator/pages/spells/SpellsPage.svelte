<script lang="ts">
    import type { Class } from "$lib/bindings";
    import type { CharacterSimulationState } from "$lib/characterSimulator.svelte";
    import Searchbox from "$lib/components/Searchbox.svelte";
    import {
        getSpellSlotTableByClassName,
        WIZARD_SPELL_SLOT_TABLE,
        type LevelSpellSlotRow,
    } from "$lib/spells";
    import SpellSlot from "./SpellSlot.svelte";

    let {
        simulationState,
        classData,
    }: {
        simulationState: CharacterSimulationState;
        classData: Class;
    } = $props();

    let searchbox = $state("");

    let slots: LevelSpellSlotRow = getSpellSlotTableByClassName(
        simulationState.character.class,
    )[simulationState.character.level];

    function onClickFocused() {
        simulationState.focused = !simulationState.focused;
    }
</script>

<div class="main-content card column">
    <Searchbox bind:value={searchbox} placeholder="Search in Spells" />
    <div class="row controls">
        <div class="row spell-slots">
            {#each Array(11) as _, i}
                <SpellSlot
                    level={i}
                    max={slots[i]}
                    value={simulationState.spellSlots[i]}
                />
            {/each}
        </div>
        <div class="row">
            <span>Focused</span>
            <!-- svelte-ignore a11y_consider_explicit_label -->
            <button
                class="circle-toggle-button"
                onclick={() => onClickFocused()}
                class:active={simulationState.focused}
            ></button>
        </div>
    </div>
</div>

<style lang="scss">
    .main-content {
        width: 100%;
        height: 100%;
    }

    .controls {
        width: 100%;
        justify-content: space-between;
    }

    .spell-slots {
        gap: 0.5rem;
    }
</style>
