<script lang="ts">
    import type { Snippet } from "svelte";
    import { createLinkPreviewActions } from "./link-preview/linkPreview";

    let {
        headerSnippet,
        children
    }: {
        headerSnippet: Snippet;
        children: Snippet
    } = $props();

    let isOpen: boolean = $state(false);

    const [floatingRef, floatingContent] = createLinkPreviewActions();

</script>

<button class="popover-trigger" onclick={() => isOpen = !isOpen} use:floatingRef>
        {@render headerSnippet()}
</button>

{#if isOpen}
    <!-- svelte-ignore a11y_click_events_have_key_events -->
    <!-- svelte-ignore a11y_no_static_element_interactions -->
    <div
        class="popover-content"
        use:floatingContent
        onclick={() => isOpen = false}
    >
        {@render children()}
    </div>
{/if}

<style lang="scss">
    .popover-trigger {
        font: inherit;
        color: inherit;
        background: none;
    }

    .popover-content {
        max-width: 20rem;
        position: absolute;
        display: flex;
        border-width: 1px;
        background-color: var(--dark-1);
        border-radius: 0.5rem;
        border: solid 0.125rem var(--dark-2);
        transition: position 0ms;
        box-shadow: 0rem 0rem 4rem #00000088;
        z-index: 999;
    }
</style>
