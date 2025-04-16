<script lang="ts">
    import type { Attribute } from "$lib/bindings";
    import { scoreToModifier } from "./character-creator/characterCreator.svelte";

    let {
        attribute,
        value = $bindable(),
        modified = false,
    }: {
        attribute: Attribute;
        value: number;
        modified?: boolean;
    } = $props();
</script>

<div class="column attribute" class:modified>
    <span class="tag">{attribute.toString().substring(0, 3)}</span>
    <span class="value">{value >= 0 ? "+" : ""}{value}</span>
</div>

<style lang="scss">
    .attribute {
        width: 5.5rem;
        padding: 1rem;
        align-items: center;
        background-color: var(--dark-2);
        border-radius: 0.5rem;
        gap: 0.5rem;

        &.modified span.value {
            color: var(--orange-lighter);
        }
    }

    .value {
        font-weight: 600;
        color: var(--light-1);
        font-size: 1.25rem;
    }
</style>
