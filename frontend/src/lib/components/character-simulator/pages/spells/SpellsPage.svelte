<script lang="ts">
    import type { Class, Spell, Summary } from "$lib/bindings";
    import type { CharacterSimulationState } from "$lib/characterSimulator.svelte";
    import Button from "$lib/components/Button.svelte";
    import Dialog from "$lib/components/dialog/Dialog.svelte";
    import Searchbox from "$lib/components/Searchbox.svelte";
    import {
        getSpellSlotTableByClassName,
        WIZARD_SPELL_SLOT_TABLE,
        type LevelSpellSlotRow,
    } from "$lib/spells";
    import SectionAccordion from "../../SectionAccordion.svelte";
    import Spellbook from "./Spellbook.svelte";
    import SpellItem from "./SpellItem.svelte";
    import SpellSlot from "./SpellSlot.svelte";

    let {
        simulationState,
        spells,
        classData,
    }: {
        simulationState: CharacterSimulationState;
        spells: Spell[];
        classData: Class;
    } = $props();

    let searchbox = $state("");

    let slots: LevelSpellSlotRow = getSpellSlotTableByClassName(
        simulationState.character.class,
    )[simulationState.character.level];

    let totalSpells: Record<number, Spell[]> = $derived.by(() => {
        let record: Record<number, Spell[]> = {
            0: [],
            1: [],
            2: [],
            3: [],
            4: [],
            5: [],
            6: [],
            7: [],
            8: [],
            9: [],
            10: [],
        };
        for (const spell of simulationState.spells) {
            let recordLevel = spell.level;
            if (spell.traits?.includes("cantrip")) {
                recordLevel = 0;
            }
            record[recordLevel].push(spell);
        }
        return record;
    });

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
        <div class="column spells-controls">
            <button class="row" onclick={() => onClickFocused()}>
                <span>Focused</span>
                <div
                    class="circle-toggle-button"
                    class:active={simulationState.focused}
                ></div>
            </button>
            <div class="row"></div>
            <Button
                cta="secondary"
                onclick={() => simulationState.refillSpellslots()}
            >
                Refill Spellslot
            </Button>
            {#snippet addSpellbookHeader(onclick: () => void)}
                <Button cta="secondary" {onclick}>Spellbook</Button>
            {/snippet}

            <Spellbook
                {simulationState}
                spellbookHeader={addSpellbookHeader}
                {spells}
            />
        </div>
    </div>
    <div class="column spell-list">
        {#each Object.entries(totalSpells) as [lvl, entrySpells]}
            <SectionAccordion
                title={lvl === "0" ? "Cantrips" : `Level ${lvl}`}
                defaultOpen={true}
            >
                <div class="column" style="width: 100%;">
                    {#each entrySpells as spell}
                        <SpellItem {simulationState} {lvl} {spell} />
                    {/each}
                </div>
            </SectionAccordion>
        {/each}
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

    .spells-controls {
        gap: 0.25rem;
    }

    .spell-list {
        width: 100%;
    }
</style>
