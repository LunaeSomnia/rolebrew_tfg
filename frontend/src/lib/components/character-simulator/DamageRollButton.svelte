<script lang="ts">
    import type { DamageRoll } from "$lib/bindings";
    import { Icon } from "$lib/icons/icons";
    import Button from "../Button.svelte";

    let {
        onclick,
        onclickX2,
    }: {
        onclick: () => void;
        onclickX2: () => void;
    } = $props();
</script>

<div class="row damage-roll-group">
    <Button
        class="damage-roll-button main"
        cta="primary"
        {onclick}
        iconLeft={Icon.Dice}
    ></Button>
    <Button class="damage-roll-button double" cta="primary" onclick={onclickX2}
        >x2</Button
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
