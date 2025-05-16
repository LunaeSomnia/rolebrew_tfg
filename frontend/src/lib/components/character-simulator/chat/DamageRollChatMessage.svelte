<script lang="ts">
    import { type Die } from "$lib/bindings";
    import {
        isDamageRollChatMessage,
        type DamageRollChatMessage,
    } from "$lib/chat";
    import { rollFromFormula } from "$lib/roll";
    import { capitalize } from "$lib/utils";
    import ChatMessage from "./ChatMessage.svelte";
    import DiceRoll from "./DiceRoll.svelte";

    let { msg }: { msg: DamageRollChatMessage } = $props();

    type DamageInfo = {
        damageType: string;
        faces: number;
        values: number[];
        total: number;
    };

    let damagesInfo: DamageInfo[] = $derived.by(() => {
        let infos: DamageInfo[] = [];
        for (let i = 0; i < msg.damages.length; i++) {
            const damage = msg.damages[i];
            const damageType = damage.type ?? damage.damageType ?? "Undefined";

            if (damage.formula) {
                const { faces, total, values } = rollFromFormula(
                    damage.formula,
                );
                infos.push({
                    damageType,
                    faces,
                    values,
                    total: msg.times2 ? total * 2 : total,
                });
            } else {
                const faces = Number.parseFloat(
                    (damage.die as Die).substring(1),
                );
                const values = msg.rolls[i];
                const total = values.reduce((t, v) => (t += v), 0);
                infos.push({
                    damageType,
                    faces,
                    values,
                    total: msg.times2 ? total * 2 : total,
                });
            }
        }

        return infos;
    });
    let totalDamage = $derived(
        damagesInfo.map((v) => v.total).reduce((t, v) => (t += v), 0),
    );
</script>

<ChatMessage>
    <span>Attacked with "{msg.name}"</span>
    {#each damagesInfo as { damageType, faces, total, values }, i}
        <div class="roll row" style="gap: 0.25rem">
            {#if values.length !== 0}
                {#each values as roll, j}
                    {#if j !== 0}
                        <span>+</span>
                    {/if}
                    <DiceRoll die={faces} {roll} />
                {/each}
            {:else}
                <span class="value">{total}</span>
            {/if}
            <span>=</span>
            <span class="value">{total}</span>
            {#if damageType}
                <span>{capitalize(damageType)}</span>
            {/if}
            {#if msg.times2}
                <span class="times2">(x2)</span>
            {/if}
        </div>
    {/each}
    {#if msg.damages.length > 1}
        <div class="roll row" style="gap: 0.25rem">
            <span>Total: </span>
            <span class="value">{totalDamage}</span>
        </div>
    {/if}
</ChatMessage>

<style>
    :global(.chat-message .roll) {
        align-items: center;
    }

    :global(.chat-message .roll > .value) {
        color: var(--light-1);
        font-weight: bold;
    }

    :global(.chat-message .roll > .times2) {
        color: var(--orange);
    }
</style>
