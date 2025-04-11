<script lang="ts">
    import type { Snippet } from "svelte";

    let {
        children,
        onclick,
    }: {
        children: Snippet;
        onclick: () => void;
    } = $props();
</script>

<button class="rollable-wrapper" {onclick}>
    {@render children()}
</button>

<style lang="scss">
    .rollable-wrapper {
        position: relative;
        all: inherit;
        padding: 0;
        cursor: pointer;

        &::before {
            --padding-size: 0.5rem;
            content: "";
            border-radius: 0.5rem;
            position: absolute;
            width: 100%;
            height: 100%;
            padding: calc(var(--padding-size) / 2) var(--padding-size);
            box-sizing: content-box;
            transform: translate(
                calc(var(--padding-size) * -1),
                calc(var(--padding-size) * -1 * 1 / 2)
            );
            mix-blend-mode: color;
            pointer-events: none;
        }

        &:hover::before {
            background-color: var(--orange);
        }
    }
</style>
