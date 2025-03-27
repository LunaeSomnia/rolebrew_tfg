<script lang="ts">
    import { goto } from "$app/navigation";
    import type { Snippet } from "svelte";
    import type { HTMLAttributes } from "svelte/elements";
    import type { LinkPreview } from "$lib/bindings";
    import LinkPreviewError from "../link-preview/LinkPreviewError.svelte";
    import LinkPreviewPanel from "../link-preview/LinkPreviewPanel.svelte";
    import {
        createLinkPreviewActions,
        HIDE_TIME_OFFSET,
        SHOW_TIME_OFFSET,
    } from "../link-preview/linkPreview";

    let {
        children,
        selected = false,
        altBackground = false,
        href,
        summaryHref,
        ...props
    }: HTMLAttributes<HTMLTableRowElement> & {
        "data-state"?: unknown;
        href?: string;
        summaryHref?: string;
        selected?: boolean;
        altBackground?: boolean;
    } & { href?: string; children: Snippet } = $props();

    const initialState = false;
    let isOpen: boolean = $state(initialState); // if the tooltip is rendered (time offset affected)
    let showTooltip: boolean = $state(initialState); // if the tooltip SHOULD render

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

{#if href}
    <tr
        {...props}
        onclick={() => goto(href)}
        style="cursor: pointer;"
        class:selected
        class:altBackground
        onmouseenter={openPreview}
        onmouseleave={closePreview}
        use:floatingRef
    >
        {@render children()}
    </tr>
{:else}
    <tr {...props} class:altBackground use:floatingRef>
        {@render children()}
    </tr>
{/if}

{#if isOpen && summaryHref}
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

<style lang="scss">
    tr {
        background-color: var(--dark-2);
        border-bottom: 0.125rem solid var(--dark-2);

        &.altBackground {
            background-color: var(--dark-3);
        }

        &.selected {
            background: color-mix(
                in hsl shorter hue,
                #{var(--dark-2)},
                #{var(--orange)} 20%
            );
            color: var(--orange-lighter);
        }

        &:hover {
            background-color: var(--dark-3);
        }

        &.altBackground:hover {
            background-color: var(--dark-4);
        }

        &:hover.selected {
            background: color-mix(
                in hsl shorter hue,
                #{var(--dark-3)},
                #{var(--orange)} 20%
            );
        }
    }
</style>
