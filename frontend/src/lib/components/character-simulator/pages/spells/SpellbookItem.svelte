<script lang="ts">
    import type { Spell } from "$lib/bindings";
    import Switch from "$lib/components/Switch.svelte";
    import Button from "$lib/components/Button.svelte";

    let {
        spell,
        active,
        included,
        onclick,
        onclickswitch,
    }: {
        spell: Spell;
        included: boolean;
        active: boolean;
        onclick: () => void;
        onclickswitch: () => void;
    } = $props();
</script>

<Button
    class="spellbook-item spaced-between {active ? 'active' : ''}"
    cta="secondary"
    {onclick}
>
    <span class="title">
        {spell.name}
    </span>
    <Switch value={included} onclick={onclickswitch} />
</Button>

<style>
    :global(.spellbook-item) {
        width: 100%;
        height: fit-content !important;
        padding: 0.5rem 1rem;
        border: 0.125rem solid var(--dark-3) !important;
        background-color: transparent !important;
        align-items: flex-start;
        border-radius: 0.5rem !important;
        translate: all var(--transition-normal);

        &.active {
            border-color: var(--orange) !important;
        }

        &:hover {
            background-color: var(--dark-3);
        }
    }

    :global(.spellbook-item .title) {
        width: calc(100% - 3rem);
        text-wrap: wrap;
        text-align: start;
    }
</style>
