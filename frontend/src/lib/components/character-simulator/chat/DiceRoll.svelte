<script lang="ts">
    import type { Die } from "$lib/bindings";
    import Dice from "$lib/components/Dice.svelte";

    let { die, roll }: { die: Die | number; roll: number } = $props();
</script>

<div class="dice-roll">
    {#if typeof die === "number"}
        <Dice dice={die} />
    {:else}
        <Dice dice={Number.parseInt(die.substring(1))} />
    {/if}
    <span class="value">{roll}</span>
</div>

<style>
    .dice-roll {
        width: 2rem;
        height: 2rem;
        position: relative;
    }

    :global(.dice-roll svg) {
        width: 2rem !important;
        height: 2rem !important;
    }

    .value {
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
        color: var(--dark-1);
        font-weight: bold;
    }
</style>
