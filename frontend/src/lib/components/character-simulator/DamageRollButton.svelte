<script lang="ts">
    import type { DamageRoll } from "$lib/bindings";
    import { Icon } from "$lib/icons/icons";
    import Button from "../Button.svelte";

    let {
        damage,
        onclick,
    }: {
        damage: DamageRoll;
        onclick?: (damage: DamageRoll, times2: boolean) => void;
    } = $props();

    function onClick(times2: boolean) {
        if (onclick) {
            onclick(damage, times2);
        }
    }
</script>

<div class="row damage-roll-group">
    <Button
        class="damage-roll-button main"
        cta="primary"
        onclick={() => onClick(false)}
        iconLeft={Icon.Dice}
    ></Button>
    <Button
        class="damage-roll-button double"
        cta="primary"
        onclick={() => onClick(true)}>x2</Button
    >
</div>

<style lang="scss">
    .damage-roll-group {
        outline: 0.125rem solid var(--orange);
        border-radius: 0.5rem;
        gap: 0;
        overflow: hidden;
        transition: all var(--transition-quick);

        &:hover {
            outline-color: var(--orange-lighter);
        }
    }

    :global(.damage-roll-button.main) {
        background-color: var(--orange) !important;
        color: var(--dark-1) !important;
    }

    :global(.damage-roll-button.double) {
        color: var(--orange) !important;

        &:hover {
            color: var(--dark-1) !important;
        }
    }

    :global(.damage-roll-button) {
        border-radius: 0 !important;
        background-color: unset !important;
        color: var(--light-2) !important;
        transition: all var(--transition-quick);

        &:hover {
            background-color: var(--orange-lighter) !important;
        }
    }
</style>
