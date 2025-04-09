<script lang="ts">
    import { hrefToSummaryHref } from "$lib/textProcessing";
    import LinkPreview from "../link-preview/LinkPreview.svelte";

    let { name, level, href } = $props();

    const summaryHref = hrefToSummaryHref(href);
</script>

<LinkPreview {href} {summaryHref} textDecorations="none" cursor="pointer">
    <div class="row">
        <span class="level">{level}</span>
        <span>{name}</span>
    </div>
</LinkPreview>

<style lang="scss">
    .row {
        border-radius: 0.5rem;
        background-color: var(--dark-3);
        color: var(--light-1);
        text-decoration: none;
        padding: 0.25rem 0.5rem;
        gap: 0.5rem;

        .level {
            color: var(--light-3);
        }
    }
</style>
