<script lang="ts">
    import type { Snippet } from "svelte";
    import DialogTitle from "./DialogTitle.svelte";
    import HorizontalDivisor from "../divisor/HorizontalDivisor.svelte";
    import { Icon } from "$lib/icons/icons";
    import IconSvg from "$lib/icons/IconSVG.svelte";
    import Button from "../Button.svelte";

    let {
        size = "small",
        headerSnippet,
        children,
        title,
    }: {
        size?: "small" | "medium" | "fill";
        title: string;
        headerSnippet: Snippet<[() => void]>;
        children: Snippet;
    } = $props();

    let isOpen = $state(false);
    let dialog: HTMLElement;

    function open() {
        isOpen = true;
    }

    function close() {
        isOpen = false;
    }
</script>

<div>
    {#if headerSnippet}
        {@render headerSnippet(open)}
    {/if}
</div>

{#if isOpen}
    <div class="dialog-underlay">
        <div
            role="dialog"
            class="dialog dialog-content column {size}"
            bind:this={dialog}
        >
            <DialogTitle>
                <h4 class="dialog-title">{title}</h4>
                <Button cta="ghost" onclick={close} iconLeft={Icon.Close} />
            </DialogTitle>
            <HorizontalDivisor />
            {#if children}
                {@render children()}
            {/if}
        </div>
    </div>
{/if}

<style lang="scss">
    :global(.dialog-underlay) {
        position: fixed;
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
        z-index: 50;
        background-color: #00000088;
        backdrop-filter: blur(0.0625rem);
    }

    :global(.dialog-title) {
        flex: 1;
    }

    :global(.dialog-content) {
        position: fixed;
        z-index: 50;
        padding: 2rem;
        border-width: 1px;
        width: 100%;
        left: 50%;
        top: 50%;
        max-height: calc(100% - 8rem);
        overflow-y: auto;
        transform: translate(-50%, -50%);
        border-radius: 0.5rem;
        max-width: calc(100% - 2rem);
        gap: 2rem;
        background-color: var(--dark-2);
        border-color: var(--dark-3);
    }

    :global(.dialog-content.small) {
        max-height: 50rem;
        max-width: 40rem;
    }

    :global(.dialog-content.medium) {
        max-height: 50rem;
        max-width: 60rem;
    }
</style>
