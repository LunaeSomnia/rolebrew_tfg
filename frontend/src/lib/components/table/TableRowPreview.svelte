<script lang="ts">
    import { goto } from "$app/navigation";
    import type { Snippet } from "svelte";
    import type { HTMLAttributes } from "svelte/elements";
    import { createFloatingActions } from "svelte-floating-ui";
    import { offset, flip, shift } from "svelte-floating-ui/dom";
    import {
        linkToLinkPreviewConverter,
        transformDescription,
    } from "$lib/textProcessing";
    import { fly } from "svelte/transition";
    import { cubicOut } from "svelte/easing";
    import Traits from "../Traits.svelte";
    import type { LinkPreview } from "$lib/bindings";

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
{#if isOpen && summaryHref}
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
    tr {
        background-color: var(--dark-2);
        border-bottom: 0.125rem solid var(--dark-1);

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
