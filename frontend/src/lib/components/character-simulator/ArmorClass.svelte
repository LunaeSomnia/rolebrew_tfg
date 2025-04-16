<script lang="ts">
    import type { Choice, Proficiency } from "$lib/bindings";
    import type { CharacterSimulationState } from "$lib/characterSimulator.svelte";
    import { Icon } from "$lib/icons/icons";
    import IconSvg from "$lib/icons/IconSVG.svelte";
    import { capitalize } from "$lib/utils";
    import Profifiency from "../Profifiency.svelte";
    import Select from "../Select.svelte";
    import ToggleButton from "../ToggleButton.svelte";

    let {
        state: characterState,
        value = $bindable(),
        armorChosen = $bindable(),
        hasShieldUp = $bindable(),
        shieldChoices = $bindable([]),
        shieldChosen = $bindable(),
    }: {
        state: CharacterSimulationState;
        value: [number, Proficiency];
        armorChosen: string | undefined;
        shieldChoices: Choice[];
        hasShieldUp: boolean;
        shieldChosen: string | undefined;
    } = $props();

    let selectableItems: Choice[] = $derived(
        characterState.equipment.equipment
            .filter((v) => v.definition.carryType === "worn" && v.worn)
            .map((v) => v.definition)
            .filter(
                (v) =>
                    v.category === "light" ||
                    v.category === "medium" ||
                    v.category === "heavy",
            )
            .map((v) => {
                return {
                    label: `${v.name} (${v.category ? capitalize(v.category) : ""})`,
                    value: v.slug,
                };
            })
            .concat({ label: "Unarmored", value: "unarmored" }),
    );
</script>

<div class="card column armor-class">
    <div class="row">
        <div class="row stat">
            <IconSvg icon={Icon.Armor} />
            <span class="ac">{value[0]}</span>
            <Profifiency proficiency={value[1]} />
        </div>
        <Select
            bind:choices={selectableItems}
            placeholder="Armor"
            bind:value={armorChosen}
        />
    </div>
    <div class="row">
        <ToggleButton iconLeft={Icon.Shield} value={false} disabled={true} />
        <Select
            bind:choices={shieldChoices}
            placeholder="Shield"
            bind:value={shieldChosen}
        />
    </div>
</div>

<style lang="scss">
    .row {
        width: 100%;
    }

    .armor-class {
        width: 20rem;
    }
    .stat {
        width: auto;
        --icon-color: var(--yellow);
        align-items: center;
        padding-right: 0.5rem;
    }
</style>
