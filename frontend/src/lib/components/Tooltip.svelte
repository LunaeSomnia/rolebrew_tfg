<script lang="ts">
    import { Tooltip } from "bits-ui";
    import { fly } from "svelte/transition";
    import { cubicOut } from "svelte/easing";

    let { delayDuration = 500, tooltipText = "Tooltip", children } = $props();
</script>

<Tooltip.Provider>
    <Tooltip.Root {delayDuration}>
        <Tooltip.Trigger class="tooltip-trigger">
            {@render children()}
        </Tooltip.Trigger>
        <Tooltip.Portal>
            <Tooltip.Content sideOffset={8} forceMount arrowPadding={0}>
                {#snippet child({ wrapperProps, props, open })}
                    {#if open}
                        <div {...wrapperProps}>
                            <div
                                {...props}
                                class="tooltip-content"
                                transition:fly={{
                                    duration: 200,
                                    y: 8,
                                    easing: cubicOut,
                                }}
                            >
                                {tooltipText}
                            </div>
                        </div>
                    {/if}
                {/snippet}
            </Tooltip.Content>
        </Tooltip.Portal>
    </Tooltip.Root>
</Tooltip.Provider>

<style lang="scss">
    :global(.tooltip-trigger) {
        background-color: inherit;
        border: none;
    }

    :global(.tooltip-content) {
        z-index: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        border-width: 1px;

        background-color: var(--dark-1);
        border-radius: 0.5rem;
        transition: position none;
        padding: 0.5rem 1rem;
        box-shadow: 0px 0px 0.5rem 0px rgba(0, 0, 0, 0.5);
    }

    :global([data-bits-floating-content-wrapper]) {
        position: fixed;
        transition: position 0ms;
    }
</style>
