<script>
    import VerticalDivisor from "$lib/components/divisor/VerticalDivisor.svelte";

    let { children } = $props();
</script>

<div class="chat-message row">
    <VerticalDivisor />
    <div class="column">
        <span class="tag small" style="color: var(--orange);">You</span>
        {#if children}
            {@render children()}
        {/if}
    </div>
</div>

<style>
    .chat-message {
        gap: 0.5rem;
    }

    :global(.chat-message > .divisor) {
        background-color: var(--orange);
    }

    :global(.chat-message > .column) {
        gap: 0.5rem;
    }
</style>
