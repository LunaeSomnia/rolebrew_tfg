<script lang="ts">
    import type { Skill } from "$lib/bindings";
    import Select from "../Select.svelte";
    import { SKILLS } from "./characterCreator.svelte";

    let {
        trainableSkills = $bindable(),
        value = $bindable(),
    }: {
        trainableSkills: Skill[];
        value: Skill | undefined;
    } = $props();
</script>

<Select
    choices={SKILLS.map((v) => {
        return {
            label: v,
            value: v,
            disabled: !trainableSkills.includes(v),
        };
    })}
    placeholder="Select Skill to Train"
    bind:value
/>

<style lang="scss">
    .attribute-selector {
        width: 100%;
    }
    button {
        padding: 0.5rem 1rem;
        border-radius: 0.5rem;
        font-size: inherit;
        font-family: inherit;
        font-weight: inherit;
        background-color: var(--dark-3);
        color: var(--light-2);
        cursor: pointer;
        width: 100%;

        &.active {
            background-color: var(--orange-darker);

            span {
                color: var(--orange-lighter);
            }
        }
    }
</style>
