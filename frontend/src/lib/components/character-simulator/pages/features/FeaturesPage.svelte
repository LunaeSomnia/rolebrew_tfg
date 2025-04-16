<script lang="ts">
    import type { CharacterSimulationState } from "$lib/characterSimulator.svelte";
    import SectionAccordion from "../../SectionAccordion.svelte";
    import FeatureCard from "./FeatureCard.svelte";

    let {
        simulationState,
    }: {
        simulationState: CharacterSimulationState;
    } = $props();

    let ancestryFeatures = simulationState.character.features
        .filter((v) => v.category === "ancestryfeature")
        .sort((a, b) => a.level - b.level);

    let backgroundFeatures = simulationState.character.features
        .filter((v) => v.category === "backgroundfeature")
        .sort((a, b) => a.level - b.level);

    let classFeatures = simulationState.character.features
        .filter((v) => v.category === "classfeature")
        .sort((a, b) => a.level - b.level);

    let skillFeatures = simulationState.character.features
        .filter((v) => v.category === "skill")
        .sort((a, b) => a.level - b.level);

    let otherFeatures = simulationState.character.features
        .filter((v) => v.category !== "ancestryfeature")
        .filter((v) => v.category !== "backgroundfeature")
        .filter((v) => v.category !== "classfeature")
        .filter((v) => v.category !== "skill")
        .sort((a, b) => a.level - b.level);
</script>

<div class="main-content card column">
    {#each otherFeatures as feature}
        <FeatureCard {feature} defaultOpen={false} />
    {/each}

    {#if skillFeatures.length !== 0}
        <SectionAccordion title="Skill Features">
            {#each skillFeatures as feature}
                <FeatureCard {feature} defaultOpen={false} />
            {/each}
        </SectionAccordion>
    {/if}

    {#if ancestryFeatures.length !== 0}
        <SectionAccordion title="Ancestry Features">
            {#each ancestryFeatures as feature}
                <FeatureCard {feature} defaultOpen={false} />
            {/each}
        </SectionAccordion>
    {/if}

    {#if backgroundFeatures.length !== 0}
        <SectionAccordion title="Background Features">
            {#each backgroundFeatures as feature}
                <FeatureCard {feature} defaultOpen={false} />
            {/each}
        </SectionAccordion>
    {/if}

    {#if classFeatures.length !== 0}
        <SectionAccordion title="Class Features">
            {#each classFeatures as feature}
                <FeatureCard {feature} defaultOpen={false} />
            {/each}
        </SectionAccordion>
    {/if}
</div>

<style lang="scss">
    .main-content {
        width: 100%;
        height: 100%;
    }
</style>
