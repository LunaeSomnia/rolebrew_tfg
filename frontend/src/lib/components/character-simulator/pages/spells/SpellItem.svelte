<script lang="ts">
    import type { DamageRoll, Spell } from "$lib/bindings";
    import type { CharacterSimulationState } from "$lib/characterSimulator.svelte";
    import Button from "$lib/components/Button.svelte";
    import { Icon } from "$lib/icons/icons";
    import IconSvg from "$lib/icons/IconSVG.svelte";
    import { roll } from "$lib/roll";
    import AttackRollButton from "../../AttackRollButton.svelte";
    import DamageRollButton from "../../DamageRollButton.svelte";

    let {
        simulationState,
        lvl,
        spell,
    }: {
        simulationState: CharacterSimulationState;
        lvl: string;
        spell: Spell;
    } = $props();

    let attackModifier = $derived(
        simulationState.character.attributeModifiers[
            simulationState.character.keyAbility[0]
        ],
    );
    let damageRolls = $derived(spell.damage ?? []);

    function rollAttack(modifier: number) {
        simulationState.pushChatMessage(
            `rolled ${name} attack: ${roll(20) + modifier}`,
        );
    }

    function rollDamages(damages: DamageRoll[], times2: boolean = false) {
        for (const damage of damages) {
            const roll = rollDamage(damage, times2);

            simulationState.pushChatMessage(
                `rolled damage: ${roll} ${damage.damageType} damage`,
            );
        }
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

        return rolled;
    }

    function useSpell() {
        simulationState.pushChatMessage(`used spell: ${spell.name}`);
    }
</script>

<div class="row spell-item spaced-between">
    <div class="row spaced-group">
        <span class="tag">{lvl}</span>
        <span class="name">{spell.name}</span>
    </div>

    <div class="row spaced-group">
        {#if damageRolls.length !== 0}
            <AttackRollButton modifier={attackModifier} onclick={rollAttack} />
            <DamageRollButton
                onclick={() => rollDamages(damageRolls)}
                onclickX2={() => rollDamages(damageRolls, true)}
            />
        {:else}
            <Button cta="primary" onclick={useSpell}>Use</Button>
        {/if}
    </div>
</div>

<style lang="scss">
    .spell-item {
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
