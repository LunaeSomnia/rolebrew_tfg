<script lang="ts">
    import type { Equipment, Summary } from "$lib/bindings";
    import {
        EquipmentItemState,
        type CharacterSimulationState,
    } from "$lib/characterSimulator.svelte";
    import Button from "$lib/components/Button.svelte";
    import ListItem from "$lib/components/character-creator/ListItem.svelte";
    import Dialog from "$lib/components/dialog/Dialog.svelte";
    import Searchbox from "$lib/components/Searchbox.svelte";
    import { Icon } from "$lib/icons/icons";
    import Coin from "./Coin.svelte";
    import EquipmentItem from "./EquipmentItem.svelte";

    let {
        simulationState,
        equipmentSummaries,
    }: {
        equipmentSummaries: Summary[];
        simulationState: CharacterSimulationState;
    } = $props();

    let searchbox = $state("");

    // dialog
    let dialogSearchbox = $state("");

    let added: Summary[] = $state([]);
    let bought: Summary[] = $state([]);

    let totalEquipment = $derived(
        equipmentSummaries.filter((v) =>
            v.name.toLocaleLowerCase().includes(dialogSearchbox),
        ),
    );

    function addEquipment(summary: Summary) {
        if (!added.includes(summary)) added.push(summary);
    }

    function removeAddedEquipment(summary: Summary) {
        added = added.filter((v) => v.slug !== summary.slug);
    }

    function buyEquipment(summary: Summary) {
        if (!bought.includes(summary)) bought.push(summary);
    }

    function removeBoughtEquipment(summary: Summary) {
        bought = bought.filter((v) => v.slug !== summary.slug);
    }

    async function onFinish() {
        const toAdd = [...added, ...bought];
        const requests = toAdd.map((v) =>
            fetch("/api/equipment/" + v.slug).then(
                (v) => v.json() as unknown as Equipment,
            ),
        );

        const results = await Promise.all(requests);
        const equipmentItems: EquipmentItemState[] = results.map((v) => {
            return new EquipmentItemState(v);
        });

        simulationState.equipment.equipment =
            simulationState.equipment.equipment.concat(equipmentItems);
    }

    $effect(() => {
        $inspect(simulationState.equipment);
    });
</script>

<div class="main-content card column">
    <div class="row">
        <Searchbox bind:value={searchbox} placeholder="Search in Equipment" />
        {#snippet addEquipmentHeader(onclick: () => void)}
            <Button cta="secondary" {onclick}>Add Equipment</Button>
        {/snippet}

        <Dialog
            title="Add Equipment"
            headerSnippet={addEquipmentHeader}
            size="medium"
        >
            <div class="row" style="width: 100%; position: relative;">
                <div class="column" style="width: 100%;">
                    <Searchbox
                        bind:value={dialogSearchbox}
                        placeholder="Search equipment"
                    />

                    <div class="column equipment-list">
                        {#each totalEquipment as summary}
                            {@const isAdded = added.includes(summary)}
                            {@const isBought = bought.includes(summary)}
                            <div
                                class="row equipment-list-item"
                                class:disabled={isAdded || isBought}
                            >
                                <span>{summary.name}</span>
                                <Button
                                    cta="secondary"
                                    iconLeft={Icon.Plus}
                                    onclick={() => addEquipment(summary)}
                                ></Button>
                                <Button
                                    cta="secondary"
                                    onclick={() => buyEquipment(summary)}
                                    >Buy</Button
                                >
                            </div>
                        {/each}
                    </div>
                </div>
                <div
                    class="column spaced-between"
                    style="width: 100%; align-self: stretch; align-items: flex-end;"
                >
                    <div class="column equipment-list">
                        <h6>Added</h6>
                        {#each added as summary}
                            <div class="row equipment-list-item">
                                <span>{summary.name}</span>
                                <Button
                                    cta="secondary"
                                    iconLeft={Icon.Minus}
                                    onclick={() =>
                                        removeAddedEquipment(summary)}
                                ></Button>
                            </div>
                        {/each}
                    </div>
                    <div class="column equipment-list">
                        <h6>Bought</h6>
                        {#each bought as summary}
                            <div class="row equipment-list-item">
                                <span>{summary.name}</span>
                                <Button
                                    cta="secondary"
                                    iconLeft={Icon.Minus}
                                    onclick={() =>
                                        removeBoughtEquipment(summary)}
                                ></Button>
                            </div>
                        {/each}
                    </div>
                    <div class="row" style="justify-content: flex-end;">
                        <Button cta="primary" onclick={onFinish}>Finish</Button>
                    </div>
                </div>
            </div>
        </Dialog>
    </div>
    <div class="row" style="justify-content: flex-end; gap: 0.5rem;">
        <div class="row coins" style="gap: 0.5rem;">
            <Coin type="platinum" value={simulationState.money.platinum} />
            <Coin type="gold" value={simulationState.money.gold} />
            <Coin type="silver" value={simulationState.money.silver} />
            <Coin type="copper" value={simulationState.money.copper} />
        </div>
    </div>
    {#each simulationState.equipment.equipment as equipment}
        <EquipmentItem {equipment} />
    {/each}
</div>

<style lang="scss">
    .main-content {
        width: 100%;
        height: 100%;

        .row {
            width: 100%;
        }
    }

    .coins {
        width: fit-content !important;
    }

    :global(.equipment-list-item) {
        width: 100%;
        align-items: center;
        border-radius: 0.5rem;
        border: 0.125rem solid var(--dark-3);
        padding: 0.5rem;
        padding-left: 1rem;
        gap: 0.5rem;

        span {
            flex: 1;
        }

        &.disabled {
            opacity: 0.5;
            user-select: none;
            pointer-events: none;
        }
    }

    :global(.equipment-list) {
        height: 100%;
        max-height: 30rem;
        overflow-y: auto;
        width: 100%;
        gap: 0.5rem;
    }
</style>
