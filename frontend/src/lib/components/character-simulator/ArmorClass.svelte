<script lang="ts">
    import type { Choice } from "$lib/bindings";
    import { Icon } from "$lib/icons/icons";
    import IconSvg from "$lib/icons/IconSVG.svelte";
    import Select from "../Select.svelte";
    import ToggleButton from "../ToggleButton.svelte";

    let {
        value = $bindable(),
        armorChoices = $bindable([{ label: "Unarmored", value: "Unarmored" }]),
        armorChosen = $bindable(),
        hasShieldUp = $bindable(),
        shieldChoices = $bindable([]),
        shieldChosen = $bindable(),
    }: {
        value: number;
        armorChoices: Choice[];
        armorChosen: string | undefined;
        shieldChoices: Choice[];
        hasShieldUp: boolean;
        shieldChosen: string | undefined;
    } = $props();
</script>

<div class="card column armor-class">
    <div class="row">
        <div class="row stat">
            <IconSvg icon={Icon.Armor} />
            <span class="ac">{value}</span>
        </div>
        <Select
            bind:choices={armorChoices}
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
    }
</style>
