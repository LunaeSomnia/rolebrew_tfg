<script lang="ts">
    import {
        linkToLinkPreviewConverter,
        transformDescription,
    } from "$lib/textProcessing";
    import Traits from "../Traits.svelte";
    import LinkPreviewContainer from "./LinkPreviewContainer.svelte";

    let { floatingContent, openPreview, closePreview, preview } = $props();
</script>

<LinkPreviewContainer {floatingContent} {openPreview} {closePreview}>
    <div class="column link-preview-header">
        <h4>{preview.name}</h4>
        <Traits rarity={preview.rarity} traits={preview.traits} />
    </div>
    <div class="column link-preview-content">
        {@html linkToLinkPreviewConverter(
            transformDescription(preview.description),
        )}
    </div>
</LinkPreviewContainer>

<style lang="scss">
    .link-preview-header {
        gap: 0.5rem;
    }

    .link-preview-content {
        gap: 0.5rem;
    }
</style>
