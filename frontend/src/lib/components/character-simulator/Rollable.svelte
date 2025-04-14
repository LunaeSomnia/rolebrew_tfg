<script lang="ts">
    import type { Snippet } from "svelte";

    let {
        children,
        onclick,
        expandOnHover = false,

        class: classData,
        style,
        ...p
    }: {
        children: Snippet;
        onclick: () => void;
        expandOnHover?: boolean;

        class?: string;
        style?: string;
        p?: any;
    } = $props();
</script>

<button
    class="rollable-wrapper {classData}"
    class:expandOnHover
    {onclick}
    {style}
    {...p}
>
    {@render children()}
</button>

<style lang="scss">
    .rollable-wrapper {
        position: relative;
        all: inherit;
        padding: 0;
        cursor: pointer;

        &::before {
            content: "";
            border-radius: 0.5rem;
            position: absolute;
            width: 100%;
            height: 100%;
            box-sizing: content-box;
            transform: translate(
                -calc(var(--padding-size)),
                -calc(var(--padding-size) / 2)
            );
            // mix-blend-mode: color;
            pointer-events: none;
            opacity: 0.125;
            transition: background-color ease-out var(--transition-quick);
        }

        &.expandOnHover::before {
            --padding-size: 0.5rem;
            padding: calc(var(--padding-size) / 2) var(--padding-size);
            transform: translate(
                calc(var(--padding-size) * -1),
                calc(var(--padding-size) * -1 * 1 / 2)
            );
        }

        &:hover {
            color: var(--orange-lighter);

            &::before {
                background-color: var(--orange);
            }
        }
    }
</style>
