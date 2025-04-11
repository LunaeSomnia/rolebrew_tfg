<script lang="ts">
    import type { Skill } from "$lib/bindings";
    import type { CharacterSimulationState } from "$lib/characterSimulator.svelte";
    import { Icon } from "$lib/icons/icons";
    import IconSvg from "$lib/icons/IconSVG.svelte";
    import Button from "../Button.svelte";
    import { SKILLS } from "../character-creator/characterCreator.svelte";
    import Select from "../Select.svelte";

    let {
        state: characterState,
        value = $bindable(),
    }: {
        state: CharacterSimulationState;
        value: number | undefined;
    } = $props();

    let chosenSkill: Skill | undefined = $state();

    function onRoll() {
        if (chosenSkill) characterState.rollInitiative(chosenSkill);
    }
</script>

<div class="card row initiative">
    <div class="row stat">
        <IconSvg icon={Icon.Initiative} />
        <span class="ac">{value ? value : "?"}</span>
    </div>
    <Select
        choices={SKILLS.map((v) => {
            return {
                label: v,
                value: v,
            };
        })}
        placeholder="Skill"
        bind:value={chosenSkill}
    />
    <Button cta="secondary" onclick={onRoll} iconLeft={Icon.Dice} />
</div>

<style lang="scss">
    .initiative {
        width: 100%;

        .stat {
            --icon-color: var(--green);
        }
    }
</style>
