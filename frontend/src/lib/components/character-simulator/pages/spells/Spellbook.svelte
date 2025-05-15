<script lang="ts">
    import type { Spell, Summary } from "$lib/bindings";
    import Dialog from "$lib/components/dialog/Dialog.svelte";
    import Searchbox from "$lib/components/Searchbox.svelte";
    import type { Snippet } from "svelte";
    import SectionAccordion from "../../SectionAccordion.svelte";
    import SpellbookItem from "./SpellbookItem.svelte";
    import SpellbookItemDesc from "./SpellbookItemDesc.svelte";
    import type { CharacterSimulationState } from "$lib/characterSimulator.svelte";

    let {
        simulationState,
        spells,
        spellbookHeader,
    }: {
        simulationState: CharacterSimulationState;
        spells: Spell[];
        spellbookHeader: Snippet<[() => void]>;
    } = $props();

    let searchbox = $state("");
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
        for (const spell of spells) {
            let recordLevel = spell.level;
            if (spell.traits?.includes("cantrip")) {
                recordLevel = 0;
            }
            record[recordLevel].push(spell);
        }
        return record;
    });

    let selectedItem: Spell | undefined = $state();

    let shownItems = $derived.by(() => {
        let record: Record<string, Spell[]> = {};
        for (let [key, spells] of Object.entries(totalSpells)) {
            if (searchbox !== "")
                spells = spells.filter((v) =>
                    v.name
                        .toLocaleLowerCase()
                        .includes(searchbox.toLocaleLowerCase()),
                );
            spells = spells.sort((a, b) => a.name.localeCompare(b.name));
            record[key] = spells;
        }
        return record;
    });

    function addSpell(spell: Spell) {
        simulationState.spells.push(spell);
    }

    function removeSpell(spell: Spell) {
        simulationState.spells = simulationState.spells.filter(
            (v) => v.slug !== spell.slug,
        );
    }

    function onClickSwitch(included: boolean, spell: Spell) {
        if (included) {
            removeSpell(spell);
        } else {
            addSpell(spell);
        }
    }
</script>

<div class="spellbook">
    <Dialog title="Spellbook" headerSnippet={spellbookHeader} size="medium">
        <div class="wrapper row">
            <aside>
                <Searchbox
                    bind:value={searchbox}
                    placeholder="Search in Spells"
                />
                {#each Object.entries(shownItems) as [key, spells]}
                    <SectionAccordion
                        title={key === "0" ? "Cantrips" : `Level ${key}`}
                        defaultOpen={false}
                    >
                        <div class="column">
                            {#each spells as spell}
                                {@const included =
                                    simulationState.spells.find(
                                        (v) => v.slug === spell.slug,
                                    ) !== undefined}
                                <SpellbookItem
                                    {spell}
                                    {included}
                                    active={selectedItem?.slug === spell.slug}
                                    onclick={() => (selectedItem = spell)}
                                    onclickswitch={() =>
                                        onClickSwitch(included, spell)}
                                />
                            {/each}
                        </div>
                    </SectionAccordion>
                {/each}
            </aside>
            <main>
                {#if selectedItem}
                    <SpellbookItemDesc spell={selectedItem} />
                {/if}
            </main>
        </div>
    </Dialog>
</div>

<style>
    :global(.spellbook .wrapper) {
        height: 100%;
        overflow: hidden;
        align-items: stretch;
        gap: 2rem;
    }

    :global(.spellbook aside) {
        width: 16rem;
        min-width: 16rem;
        overflow: hidden;
        overflow-y: scroll;
        align-items: stretch;
    }

    :global(.spellbook aside .column) {
        margin-top: 1rem;
        gap: 0.5rem;
    }
</style>
