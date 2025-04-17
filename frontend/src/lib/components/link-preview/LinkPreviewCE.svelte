<svelte:options customElement="link-preview" />

<script lang="ts">
    import { hrefToSummaryHref } from "$lib/textProcessing";
    import LinkPreview from "./LinkPreview.svelte";

    let { href, text }: { href: string; text: string } = $props();

    const numbers = ["0", "1", "2", "3", "4"];

    if (
        numbers.includes(href.charAt(href.length - 1)) &&
        href.charAt(href.length - 2) === "-"
    ) {
        href = href.substring(0, href.length - 2);
    }

    const summaryHref = hrefToSummaryHref(href);
</script>

<link rel="stylesheet" href="/styles.css" />

<LinkPreview {href} {summaryHref}>{text}</LinkPreview>
