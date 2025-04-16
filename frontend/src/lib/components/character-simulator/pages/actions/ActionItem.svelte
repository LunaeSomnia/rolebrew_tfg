<script lang="ts">
    import type { DamageRoll } from "$lib/bindings";
    import type { CharacterSimulationState } from "$lib/characterSimulator.svelte";
    import { Icon } from "$lib/icons/icons";
    import IconSvg from "$lib/icons/IconSVG.svelte";
    import { roll } from "$lib/roll";
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

    let attackModifier = $derived(
        ranged
            ? simulationState.character.attributeModifiers.Dexterity
            : simulationState.character.attributeModifiers.Strength,
    );

    function rollAttack(modifier: number) {
        simulationState.pushChatMessage(
            `rolled ${name} attack: ${roll(20) + modifier}`,
        );
    }

    function rollDamage(damage: DamageRoll, times2: boolean) {
        let rolled = 0;
        for (let i = 0; i < (damage.dice ?? 0); i++) {
            let faces = 0;
            if (typeof damage.die === "number") {
                faces = damage.die;
            } else if (damage.die) {
                faces = Number.parseInt(damage.die[1]);
            }
            rolled += roll(faces);
        }

        if (times2) {
            rolled *= 2;
        }

        simulationState.pushChatMessage(
            `rolled ${name} damage: ${rolled} ${damage.damageType} damage`,
        );
    }
</script>

<div class="row action-item spaced-between">
    <div class="row spaced-group">
        <span class="name">{name}</span>
        <IconSvg icon={Icon.Action} />
    </div>

    <div class="row spaced-group">
        {#if damage}
            <AttackRollButton modifier={attackModifier} onclick={rollAttack} />
            <DamageRollButton {damage} onclick={rollDamage} />
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
