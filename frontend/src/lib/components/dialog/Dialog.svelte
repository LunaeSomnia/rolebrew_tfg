<script lang="ts">
    import { Dialog, Label } from "bits-ui";
    import type { Snippet } from "svelte";
    import DialogTitle from "./DialogTitle.svelte";
    import HorizontalDivisor from "../divisor/HorizontalDivisor.svelte";
    import { Icon } from "$lib/icons/icons";
    import IconSvg from "$lib/icons/IconSVG.svelte";
    import Button from "../Button.svelte";

    let {
        headerSnippet,
        children,
        title,
    }: {
        title: string;
        headerSnippet: Snippet;
        children: Snippet;
    } = $props();

    let open = $state(false);
</script>

<Dialog.Root bind:open>
    <Dialog.Trigger class="row dialog-trigger">
        {@render headerSnippet()}
    </Dialog.Trigger>
    <Dialog.Portal>
        <Dialog.Overlay class="dialog-overlay" />
        <Dialog.Content class="dialog-content dialog column">
            <DialogTitle>
                <h4 class="dialog-title">{title}</h4>
                <Button cta="ghost" onclick={() => (open = false)}>
                    <IconSvg icon={Icon.Close} />
                </Button>
            </DialogTitle>
            <HorizontalDivisor />
            {@render children()}
        </Dialog.Content>
    </Dialog.Portal>
</Dialog.Root>

<style lang="scss">
    :global(.dialog-trigger) {
        display: inline-flex;
        padding: 0;
        margin: 0;
        outline: 0;
        border: 0;
        background-color: unset;
    }

    :global(.dialog-overlay) {
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
        transform: translate(-50%, -50%);
        border-radius: 0.5rem;
        max-width: calc(100% - 2rem);
        gap: 2rem;
        background-color: var(--dark-2);
        border-color: var(--dark-3);

        @media (min-width: 640px) {
            max-width: 490px;
        }
        @media (min-width: 768px) {
            width: 100%;
        }
    }
</style>
