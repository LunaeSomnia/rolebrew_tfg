<script lang="ts">
    import type { DamageRoll, Spell } from "$lib/bindings";
    import type { CharacterSimulationState } from "$lib/characterSimulator.svelte";
    import { ChatMessageType, type SpellCastChatMessage } from "$lib/chat";
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

    function useSpell() {
        simulationState.pushChatMessage(ChatMessageType.SpellCast, {
            spell,
        } as SpellCastChatMessage);
    }
</script>

<div class="row spell-item spaced-between">
    <div class="row spaced-group">
        <span class="tag">{lvl}</span>
        <span class="name">{spell.name}</span>
    </div>

    <div class="row spaced-group">
        {#if damageRolls.length !== 0}
            <AttackRollButton
                modifier={attackModifier}
                onclick={(modifier) =>
                    simulationState.rollAttack(
                        spell.name,
                        simulationState.character.keyAbility[0],
                        modifier,
                    )}
            />
            <DamageRollButton
                onclick={() =>
                    simulationState.rollDamages(spell.name, damageRolls)}
                onclickX2={() =>
                    simulationState.rollDamages(spell.name, damageRolls, true)}
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
