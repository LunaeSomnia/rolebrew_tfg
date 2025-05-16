<script lang="ts">
    import type { StringChatMessage } from "$lib/chat";
    import ChatMessage from "./ChatMessage.svelte";

    let { msg }: { msg: StringChatMessage } = $props();
</script>

<ChatMessage>
    <span>{msg.value}</span>
</ChatMessage>
