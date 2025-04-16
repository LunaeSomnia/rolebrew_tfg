<script lang="ts">
    import type { CharacterSimulationState } from "$lib/characterSimulator.svelte";
    import Input from "$lib/components/Input.svelte";
    import TextArea from "$lib/components/TextArea.svelte";

    let {
        simulationState,
    }: {
        simulationState: CharacterSimulationState;
    } = $props();
</script>

<div class="main-content card column">
    <h5>Origin and Appareance</h5>
    <div class="row">
        <div class="column field">
            <span class="small tag"> Ethnicity </span>
            <Input
                bind:value={simulationState.info.ethnicity}
                placeholder="Ethnicity"
            />
        </div>
        <div class="column field">
            <span class="small tag"> Nationality </span>
            <Input
                bind:value={simulationState.info.nationality}
                placeholder="Nationality"
            />
        </div>
        <div class="column field">
            <span class="small tag"> Birthplace </span>
            <Input
                bind:value={simulationState.info.birthplace}
                placeholder="Birthplace"
            />
        </div>
    </div>
    <div class="row">
        <div class="column field">
            <span class="small tag"> Age </span>
            <Input bind:value={simulationState.info.age} placeholder="Age" />
        </div>
        <div class="column field">
            <span class="small tag"> Gender & Pronouns </span>
            <Input
                bind:value={simulationState.info.genderAndPronouns}
                placeholder="Gender & Pronouns"
            />
        </div>
        <div class="column field">
            <span class="small tag"> Height </span>
            <Input
                bind:value={simulationState.info.height}
                placeholder="Height"
            />
        </div>
        <div class="column field">
            <span class="small tag"> Weight </span>
            <Input
                bind:value={simulationState.info.weight}
                placeholder="Weight"
            />
        </div>
    </div>
    <div class="column field m-4">
        <span class="small tag"> Appareance </span>
        <TextArea
            bind:value={simulationState.info.appareance}
            placeholder="Appareance"
        />
    </div>
    <h5>Personality</h5>
    <div class="row">
        <div class="column field">
            <span class="small tag"> Attitude </span>
            <Input
                bind:value={simulationState.info.attitude}
                placeholder="Attitude"
            />
        </div>
        <div class="column field">
            <span class="small tag"> Deity or Philosophy </span>
            <Input
                bind:value={simulationState.info.deityOrPhilosophy}
                placeholder="Deity or Philosophy"
            />
        </div>
    </div>
    <div class="row">
        <div class="column field">
            <span class="small tag"> Edicts </span>
            <TextArea
                bind:value={simulationState.info.edicts}
                placeholder="Edicts"
            />
        </div>
        <div class="column field">
            <span class="small tag"> Anathema </span>
            <TextArea
                bind:value={simulationState.info.anathema}
                placeholder="Anathema"
            />
        </div>
    </div>
    <div class="column field">
        <span class="small tag"> Likes </span>
        <TextArea bind:value={simulationState.info.likes} placeholder="Likes" />
    </div>
    <div class="column field">
        <span class="small tag"> Dislikes </span>
        <TextArea
            bind:value={simulationState.info.dislikes}
            placeholder="Dislikes"
        />
    </div>
    <div class="column field m-4">
        <span class="small tag"> Catchphrases </span>
        <TextArea
            bind:value={simulationState.info.catchphrases}
            placeholder="Catchphrases"
        />
    </div>
    <h5>Campaign Notes</h5>
    <div class="column field">
        <span class="small tag"> Notes </span>
        <TextArea bind:value={simulationState.info.notes} placeholder="Notes" />
    </div>
    <div class="row">
        <div class="column field">
            <span class="small tag"> Allies </span>
            <Input
                bind:value={simulationState.info.allies}
                placeholder="Allies"
            />
        </div>
        <div class="column field">
            <span class="small tag"> Enemies </span>
            <Input
                bind:value={simulationState.info.enemies}
                placeholder="Enemies"
            />
        </div>
        <div class="column field">
            <span class="small tag"> Organizations </span>
            <Input
                bind:value={simulationState.info.organizations}
                placeholder="Organizations"
            />
        </div>
    </div>
</div>

<style lang="scss">
    .main-content {
        width: 100%;
        height: 100%;
        gap: 2rem;
    }

    .row,
    .column {
        width: 100%;
    }

    .field {
        width: 100%;
        gap: 0.5rem;
    }
</style>
