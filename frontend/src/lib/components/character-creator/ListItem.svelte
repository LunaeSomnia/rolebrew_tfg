<script lang="ts">
    import type { Summary } from "$lib/bindings";

    let {
        summary,
        selected = false,
        onclick,
        ...props
    }: { summary: Summary; selected: boolean; onclick: any } = $props();
</script>

<button {onclick} {...props} class:selected>
    <span>{summary.name}</span>
</button>

<style lang="scss">
    button {
        width: 100%;
        text-align: start;
        font-size: inherit;
        color: inherit;
        background-color: unset;
        padding: 0.5rem 1rem;
        border: 0.125rem solid var(--dark-3);
        border-radius: 0.5rem;
        cursor: pointer;
        transition: all var(--transition-quick);

        &.selected {
            background-color: var(--orange-darker);
            border-color: var(--orange-darker);
            color: var(--orange-lighter);
        }
    }
</style>
