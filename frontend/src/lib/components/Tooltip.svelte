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

    let { text, children } = $props();

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
    {@render children()}
</div>

{#if isOpen}
    <!-- svelte-ignore a11y_no_static_element_interactions -->
    <div
        class="tooltip column"
        use:floatingContent
        transition:fly|global={{
            duration: 200,
            y: 8,
            easing: cubicOut,
        }}
        onmouseenter={openPreview}
        onmouseleave={closePreview}
    >
        {text}
    </div>
{/if}

<style lang="scss">
    .tooltip {
        max-width: 40rem;
        position: absolute;
        display: flex;
        border-width: 1px;
        background-color: var(--dark-1);
        border-radius: 0.5rem;
        transition: position 0ms;
        padding: 0.5rem 1rem;
        border: solid 0.125rem var(--dark-2);
        box-shadow: 0rem 0rem 4rem #00000088;
        gap: 2rem;
    }
</style>
