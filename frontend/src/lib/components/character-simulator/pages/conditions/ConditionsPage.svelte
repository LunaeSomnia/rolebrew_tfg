<script lang="ts">
    import type { CharacterSimulationState } from "$lib/characterSimulator.svelte";
    import { capitalize } from "$lib/utils";
    import SectionAccordion from "../../SectionAccordion.svelte";
    import ConditionCard from "./ConditionCard.svelte";

    let {
        simulationState = $bindable(),
    }: {
        simulationState: CharacterSimulationState;
    } = $props();

    const SECTIONS = ["senses", "abilities", "attitudes", "death", "detection"];

    let conditionsMap = $derived(
        simulationState.items.conditions.map((v, i) => {
            return {
                index: i,
                value: v,
            };
        }),
    );
</script>

<div class="main-content card">
    <div class="row conditions">
        {#each SECTIONS as section}
            {@const conditionsInSection = conditionsMap.filter(
                (v) => v.value.definition.group === section,
            )}
            <SectionAccordion title={capitalize(section)}>
                {#each conditionsInSection as { value, index }}
                    <ConditionCard
                        bind:condition={simulationState.items.conditions[index]}
                    />
                {/each}
            </SectionAccordion>
        {/each}
    </div>
</div>

<style lang="scss">
    .main-content {
        width: 100%;
        height: 100%;

        .row {
            width: 100%;
        }
    }
</style>
