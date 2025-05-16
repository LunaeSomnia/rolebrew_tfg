<script lang="ts">
    import type { SimpleRollChatMessage } from "$lib/chat";
    import ChatMessage from "./ChatMessage.svelte";
    import DiceRoll from "./DiceRoll.svelte";

    let { msg }: { msg: SimpleRollChatMessage } = $props();
</script>

<ChatMessage>
    {#if msg.name}
        <span>{msg.name}</span>
    {/if}
    <DiceRoll die={msg.dice} roll={msg.roll} />
</ChatMessage>
