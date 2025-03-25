<script lang="ts">
    import { offset, flip, shift } from "svelte-floating-ui/dom";
    import { createFloatingActions } from "svelte-floating-ui";
    import type { LinkPreview } from "$lib/bindings";
    import Traits from "./Traits.svelte";
    import { fly } from "svelte/transition";
    import { cubicOut } from "svelte/easing";
    import {
        linkToLinkPreviewConverter,
        transformDescription,
    } from "$lib/textProcessing";

    let { href, summaryHref, children } = $props();

    const showTimeOffset = 500;
    const hideTimeOffset = 200;

    const initialState = false;
    let isOpen: boolean = $state(initialState); // if the tooltip is rendered (time offset affected)
    let showTooltip: boolean = $state(initialState); // if the tooltip SHOULD render

    const [floatingRef, floatingContent] = createFloatingActions({
        strategy: "absolute",
        placement: "bottom",
        middleware: [offset(8), flip(), shift()],
    });

    function openPreview() {
        showTooltip = true;
        setTimeout(() => {
            if (showTooltip) isOpen = true;
        }, showTimeOffset);
    }

    function closePreview() {
        showTooltip = false;
        setTimeout(() => {
            if (!showTooltip) isOpen = false;
        }, hideTimeOffset);
    }

    async function getSummaryFromFetchResult(fetchResult: Response) {
        return (await fetchResult.json()) as LinkPreview;
    }
</script>

<a
    {href}
    onmouseenter={openPreview}
    onmouseleave={closePreview}
    use:floatingRef
>
    {@render children()}
</a>

{#snippet errorSnippet(error: any)}
    <!-- svelte-ignore a11y_no_static_element_interactions -->
    <div
        class="link-preview column"
        use:floatingContent
        transition:fly|global={{
            duration: 200,
            y: 8,
            easing: cubicOut,
        }}
        onmouseenter={openPreview}
        onmouseleave={closePreview}
    >
        <div class="column link-preview-header">
            <h3>Error!</h3>
            <p>{error}</p>
        </div>
    </div>
{/snippet}
{#if isOpen}
    {#await fetch(summaryHref) then fetchResult}
        {#await getSummaryFromFetchResult(fetchResult) then preview}
            <!-- svelte-ignore a11y_no_static_element_interactions -->
            <div
                class="link-preview column"
                use:floatingContent
                transition:fly|global={{
                    duration: 200,
                    y: 8,
                    easing: cubicOut,
                }}
                onmouseenter={openPreview}
                onmouseleave={closePreview}
            >
                <div class="column link-preview-header">
                    <h4>{preview.name}</h4>
                    <Traits rarity={preview.rarity} traits={preview.traits} />
                </div>
                {@html linkToLinkPreviewConverter(
                    transformDescription(preview.description),
                )}
            </div>
        {:catch error}
            {@render errorSnippet(error)}
        {/await}
    {:catch error}
        {@render errorSnippet(error)}
    {/await}
{/if}

<style lang="scss">
    .link-preview {
        max-width: 40rem;
        position: absolute;
        display: flex;
        border-width: 1px;
        background-color: var(--dark-1);
        border-radius: 0.5rem;
        transition: position 0ms;
        padding: 1.5rem;
        box-shadow: 0px 0px 0.5rem 0px rgba(0, 0, 0, 0.5);
        gap: 2rem;

        .link-preview-header {
            gap: 0.5rem;
        }
    }
</style>
