<svelte:options customElement="link-preview" />

<script>
    import { hrefToSummaryHref } from "$lib/textProcessing";
    import LinkPreview from "./LinkPreview.svelte";

    let { href, text } = $props();

    const summaryHref = hrefToSummaryHref(href);
    console.log(text);
</script>

<link rel="stylesheet" href="/styles.css" />

<LinkPreview {href} {summaryHref}>{text}</LinkPreview>

<style lang="scss">
    :host {
        user-select: text;
    }
</style>
