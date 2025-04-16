<script lang="ts">
    import Searchbox from "$lib/components/Searchbox.svelte";

    import type { CharacterSimulationState } from "$lib/characterSimulator.svelte";
    import ActionItem from "./ActionItem.svelte";
    import SectionAccordion from "../../SectionAccordion.svelte";
    import type { Action } from "$lib/bindings";
    import ActionCard from "./ActionCard.svelte";

    let {
        actions,
        simulationState,
    }: {
        actions: Action[];
        simulationState: CharacterSimulationState;
    } = $props();

    let searchbox = $state("");

    const ACCEPTED_CATEGORIES = ["simple"];

    let equipmentActions = $derived(
        simulationState.equipment.equipment.filter((v) =>
            ACCEPTED_CATEGORIES.includes(v.definition.category ?? ""),
        ),
    );

    const BASIC_ACTIONS = [
        "aid",
        "crawl",
        "delay",
        "drop-prone",
        "escape",
        "interact",
        "leap",
        "ready",
        "release",
        "seek",
        "sense-motive",
        "stand",
        "step",
        "stride",
        "strike",
        "take-cover",
    ];

    const SPECIALTY_BASICS = [
        "avert-gaze",
        "burrow",
        "dismiss",
        "fly",
        "grab-an-edge",
        "mount",
        "point-out",
        "raise-a-shield",
        "sustain",
    ];

    const EXPLORATION_ACTIONS = [
        "avoid-notice",
        "defend",
        "follow-the-expert",
        "hustle",
        "investigate",
        "repeat-a-spell",
        "research",
        "scout",
        "search",
        "sustain-an-effect",
    ];

    let basicActions = $derived(
        actions
            .filter((v) => BASIC_ACTIONS.includes(v.slug))
            .sort((a, b) => a.name.localeCompare(b.name)),
    );
    let specialtyBasics = $derived(
        actions
            .filter((v) => SPECIALTY_BASICS.includes(v.slug))
            .sort((a, b) => a.name.localeCompare(b.name)),
    );
    let explorationActions = $derived(
        actions
            .filter((v) => EXPLORATION_ACTIONS.includes(v.slug))
            .sort((a, b) => a.name.localeCompare(b.name)),
    );
    // let otherActions = $derived(
    //     actions
    //         .filter((v) => !BASIC_ACTIONS.includes(v.slug))
    //         .filter((v) => !SPECIALTY_BASICS.includes(v.slug))
    //         .filter((v) => !EXPLORATION_ACTIONS.includes(v.slug))
    //         .sort((a, b) => a.name.localeCompare(b.name)),
    // );

    let actionsData: Action[] = $state([]);
</script>

<div class="main-content card column">
    <div class="row">
        <Searchbox bind:value={searchbox} placeholder="Search in Actions" />
    </div>

    {#each equipmentActions as equipment}
        <ActionItem
            {simulationState}
            name={equipment.definition.name}
            damage={equipment.definition.damage}
        />
    {/each}

    <SectionAccordion title="Basic Actions">
        <div class="row actions">
            {#each basicActions as action}
                <ActionCard {action} />
            {/each}
        </div>
    </SectionAccordion>

    <SectionAccordion title="Specialty Basics">
        <div class="row actions">
            {#each specialtyBasics as action}
                <ActionCard {action} />
            {/each}
        </div>
    </SectionAccordion>

    <SectionAccordion title="Exploration Actions">
        <div class="row actions">
            {#each explorationActions as action}
                <ActionCard {action} />
            {/each}
        </div>
    </SectionAccordion>

    <!-- <SectionAccordion title="Other Actions" defaultOpen={false}>
        <div class="row actions">
            {#each otherActions as action}
                <ActionCard {action} />
            {/each}
        </div>
    </SectionAccordion> -->
</div>

<style lang="scss">
    .main-content {
        width: 100%;
        height: 100%;

        .row {
            width: 100%;
        }
    }

    :global(.actions, .conditions) {
        flex-wrap: wrap;
    }
</style>
