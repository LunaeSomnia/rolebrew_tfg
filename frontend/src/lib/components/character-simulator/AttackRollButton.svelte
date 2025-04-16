<script lang="ts">
    import Button from "../Button.svelte";

    let {
        modifier,
        onclick,
        versatile,
    }: {
        modifier: number;
        versatile?: boolean;
        onclick?: (modifier: number) => void;
    } = $props();

    let secondRoll = $derived(modifier + (versatile ? -4 : -5));
    let thirdRoll = $derived(modifier + (versatile ? -8 : -10));

    function onClick(modifier: number) {
        if (onclick) {
            onclick(modifier);
        }
    }
</script>

<div class="row attack-roll-group">
    <Button
        class="attack-roll-button primary"
        cta="secondary"
        onclick={() => onClick(modifier)}
        >{modifier >= 0 ? "+" : ""}{modifier}</Button
    >
    <Button
        class="attack-roll-button secondary"
        cta="secondary"
        onclick={() => onClick(secondRoll)}
        >{secondRoll >= 0 ? "+" : ""}{secondRoll}</Button
    >
    <Button
        class="attack-roll-button tertiary"
        cta="secondary"
        onclick={() => onClick(thirdRoll)}
        >{thirdRoll >= 0 ? "+" : ""}{thirdRoll}</Button
    >
</div>

<style lang="scss">
    .attack-roll-group {
        outline: 0.125rem solid var(--dark-3);
        border-radius: 0.5rem;
        gap: 0;
        overflow: hidden;
        transition: all var(--transition-quick);

        &:hover {
            outline-color: var(--dark-4);
        }
    }

    :global(.attack-roll-button.primary) {
        background-color: var(--dark-3) !important;
        color: var(--light-1) !important;
    }

    :global(.attack-roll-button) {
        border-radius: 0 !important;
        background-color: unset !important;
        color: var(--light-2) !important;
        transition: all var(--transition-quick);

        &:hover {
            color: var(--light-1) !important;
            background-color: var(--dark-4) !important;
            border-color: var(--dark-4) !important;
        }
    }
</style>
