<svelte:options customElement="link-preview" />

<script>
    import { hrefToSummaryHref } from "$lib/textProcessing";
    import LinkPreview from "./LinkPreview.svelte";

    let { href, text } = $props();

    const summaryHref = hrefToSummaryHref(href);
</script>

<link rel="stylesheet" href="/styles.css" />

<LinkPreview {href} {summaryHref}>{text}</LinkPreview>
