<script lang="ts">
    import type { ModifierRollChatMessage } from "$lib/chat";
    import ChatMessage from "./ChatMessage.svelte";
    import DiceRoll from "./DiceRoll.svelte";

    let { msg }: { msg: ModifierRollChatMessage } = $props();

    let validModifiers = $derived.by(() => {
        let modifiers = Array.from(msg.modifiers);
        modifiers.shift();
        return modifiers;
    });
    let modifierSum = $derived(
        validModifiers.map((v) => v.value).reduce((t, v) => (t += v), 0),
    );
</script>

<ChatMessage>
    <span>{msg.name}</span>
    <div class="roll row" style="gap: 0.25rem">
        <DiceRoll die={"D20"} roll={msg.roll} />
        {#if validModifiers.length > 0}
            <span>+</span>
            <span class="modifier">{modifierSum}</span>
            <span>=</span>
            <span class="value">{msg.roll + modifierSum}</span>
        {/if}
    </div>
</ChatMessage>

<style>
    :global(.chat-message .roll) {
        align-items: center;
    }

    :global(.chat-message .roll > .value) {
        color: var(--light-1);
        font-weight: bold;
    }
</style>
