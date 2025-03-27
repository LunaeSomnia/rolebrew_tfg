<script lang="ts">
    import LinkPreviewContainer from "./LinkPreviewContainer.svelte";

    let { floatingContent, openPreview, closePreview, error } = $props();
</script>

<LinkPreviewContainer {floatingContent} {openPreview} {closePreview}>
    <div class="column link-preview-header">
        <h3>Error!</h3>
        <p>{error}</p>
    </div>
</LinkPreviewContainer>
