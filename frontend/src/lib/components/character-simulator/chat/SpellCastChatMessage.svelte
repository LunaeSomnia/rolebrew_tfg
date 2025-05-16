<script lang="ts">
    import type { SpellCastChatMessage } from "$lib/chat";
    import LinkPreview from "$lib/components/link-preview/LinkPreview.svelte";
    import { hrefToSummaryHref } from "$lib/textProcessing";
    import ChatMessage from "./ChatMessage.svelte";

    let { msg }: { msg: SpellCastChatMessage } = $props();

    let href = $derived("/compendium/spell/" + msg.spell.slug);
    let summaryHref = $derived(hrefToSummaryHref(href));
</script>

<ChatMessage>
    <span
        >Casted spell <LinkPreview
            {href}
            {summaryHref}
            textDecorations="none"
            cursor="pointer"
        >
            <span>{msg.spell.name}</span>
        </LinkPreview></span
    >
</ChatMessage>
