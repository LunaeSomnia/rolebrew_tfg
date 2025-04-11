<script lang="ts">
    import { offset, flip, shift } from "svelte-floating-ui/dom";
    import { arrow, createFloatingActions } from "svelte-floating-ui";
    import type { LinkPreview } from "$lib/bindings";
    import Traits from "./Traits.svelte";
    import { fly } from "svelte/transition";
    import { cubicOut } from "svelte/easing";
    import {
        linkToLinkPreviewConverter,
        transformDescription,
    } from "$lib/textProcessing";
    import type { Snippet } from "svelte";

    let {
        text,
        textSnippet,
        children,
    }: {
        text?: string;
        textSnippet?: Snippet;
        children?: Snippet;
    } = $props();

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
</script>

<!-- svelte-ignore a11y_no_static_element_interactions -->
<div onmouseenter={openPreview} onmouseleave={closePreview} use:floatingRef>
    {#if children}
        {@render children()}
    {/if}
</div>

{#if isOpen}
    <!-- svelte-ignore a11y_no_static_element_interactions -->
    <div
        class="tooltip dialog column"
        use:floatingContent
        transition:fly|global={{
            duration: 200,
            y: 8,
            easing: cubicOut,
        }}
        onmouseenter={openPreview}
        onmouseleave={closePreview}
    >
        {#if text}
            {text}
        {:else if textSnippet}
            {@render textSnippet()}
        {/if}
    </div>
{/if}

<style lang="scss">
    .tooltip {
        max-width: 40rem;
        position: absolute;
        display: flex;
        border-radius: 0.5rem;
        transition: position 0ms;
        padding: 0.5rem 1rem;
        gap: 2rem;
    }
</style>
