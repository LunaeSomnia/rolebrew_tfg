<script lang="ts">
    import type { LinkPreview } from "$lib/bindings";
    import LinkPreviewError from "./LinkPreviewError.svelte";
    import LinkPreviewPanel from "./LinkPreviewPanel.svelte";
    import {
        createLinkPreviewActions,
        HIDE_TIME_OFFSET,
        SHOW_TIME_OFFSET,
    } from "./linkPreview";

    let {
        href,
        summaryHref,
        children,
        textDecorations = "underline",
        cursor = "auto",
    } = $props();

    const initialState = false;
    let isOpen: boolean = $state(initialState);
    let showTooltip: boolean = $state(initialState);

    const [floatingRef, floatingContent] = createLinkPreviewActions();

    function openPreview() {
        showTooltip = true;
        setTimeout(() => {
            if (showTooltip) isOpen = true;
        }, SHOW_TIME_OFFSET);
    }

    function closePreview() {
        showTooltip = false;
        setTimeout(() => {
            if (!showTooltip) isOpen = false;
        }, HIDE_TIME_OFFSET);
    }

    async function getSummaryFromFetchResult(fetchResult: Response) {
        return (await fetchResult.json()) as LinkPreview;
    }
</script>

<a
    {href}
    onmouseenter={openPreview}
    onmouseleave={closePreview}
    style="text-decoration: {textDecorations}; cursor: {cursor};"
    use:floatingRef
>
    {@render children()}
</a>

{#if isOpen}
    {#await fetch(summaryHref) then fetchResult}
        {#await getSummaryFromFetchResult(fetchResult) then preview}
            <LinkPreviewPanel
                {floatingContent}
                {closePreview}
                {openPreview}
                {preview}
            />
        {:catch error}
            <LinkPreviewError
                {floatingContent}
                {closePreview}
                {openPreview}
                {error}
            />
        {/await}
    {:catch error}
        <LinkPreviewError
            {floatingContent}
            {closePreview}
            {openPreview}
            {error}
        />
    {/await}
{/if}

<style>
    a {
        display: inline;
    }
</style>
