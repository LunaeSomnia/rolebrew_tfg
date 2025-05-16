<script lang="ts">
    import type { Attribute, DamageRoll } from "$lib/bindings";
    import type { CharacterSimulationState } from "$lib/characterSimulator.svelte";
    import { Icon } from "$lib/icons/icons";
    import IconSvg from "$lib/icons/IconSVG.svelte";
    import AttackRollButton from "../../AttackRollButton.svelte";
    import DamageRollButton from "../../DamageRollButton.svelte";

    let {
        simulationState,
        name,
        ranged,
        damage,
    }: {
        simulationState: CharacterSimulationState;
        name: string;
        ranged?: boolean;
        damage: DamageRoll | null;
    } = $props();

    let attribute: Attribute = $derived(ranged ? "Dexterity" : "Strength");
    let attackModifier = $derived(
        simulationState.character.attributeModifiers[attribute],
    );
</script>

<div class="row action-item spaced-between">
    <div class="row spaced-group">
        <span class="name">{name}</span>
        <IconSvg icon={Icon.Action} />
    </div>

    <div class="row spaced-group">
        {#if damage}
            <AttackRollButton
                modifier={attackModifier}
                onclick={(modifier) =>
                    simulationState.rollAttack(name, attribute, modifier)}
            />
            <DamageRollButton
                onclick={() => simulationState.rollDamage(name, damage, false)}
                onclickX2={() => simulationState.rollDamage(name, damage, true)}
            />
        {/if}
    </div>
</div>

<style lang="scss">
    .action-item {
        align-items: center;
        width: 100%;
        --icon-color: var(--light-3);

        .spaced-group {
            align-items: center;
        }

        .name {
            color: var(--light-1);
            font-weight: 600;
        }
    }
</style>
