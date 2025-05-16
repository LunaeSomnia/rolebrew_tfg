<script lang="ts">
    import { type Die } from "$lib/bindings";
    import type { DamageRollChatMessage } from "$lib/chat";
    import { capitalize } from "$lib/utils";
    import ChatMessage from "./ChatMessage.svelte";
    import DiceRoll from "./DiceRoll.svelte";

    let { msg }: { msg: DamageRollChatMessage } = $props();

    let sum = $derived.by(() => {
        let final = 0;

        for (const roll of msg.rolls) {
            final += roll.reduce((t, v) => (t += v), 0);
        }

        if (msg.times2) final *= 2;

        return final;
    });
</script>

<ChatMessage>
    <span>Attacked with "{msg.name}"</span>
    {#each msg.damages as damage, i}
        <div class="roll row" style="gap: 0.25rem">
            {console.log(damage)}
            {#each msg.rolls[i] as roll, j}
                {#if j !== 0}
                    <span>+</span>
                {/if}
                {#if damage.die}
                    <DiceRoll die={damage.die as Die} {roll} />
                {/if}
            {/each}
            <span>=</span>
            <span class="value">{sum}</span>
            {#if damage.damageType}
                <span>{capitalize(damage.damageType)}</span>
            {/if}
            {#if msg.times2}
                <span class="times2">(x2)</span>
            {/if}
        </div>
    {/each}
    {#if msg.damages.length > 1}
        <div class="roll row" style="gap: 0.25rem">
            <span>Total: </span>
            <span class="value">{sum}</span>
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
