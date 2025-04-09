<script lang="ts">
    import type { Icon } from "$lib/icons/icons";
    import IconSvg from "$lib/icons/IconSVG.svelte";
    import type { Snippet } from "svelte";

    let {
        children,
        cta = "primary",
        disabled = false,
        class: classData,
        iconLeft,
        iconRight,
        onclick,
        ...props
    }: {
        children?: Snippet;
        cta?: "primary" | "secondary" | "ghost";
        disabled?: boolean;
        class?: string;
        iconLeft?: Icon;
        iconRight?: Icon;
        onclick: () => void;
    } = $props();
</script>

<button
    {onclick}
    class="{cta} {classData}"
    class:disabled
    class:has-icon-left={iconLeft !== undefined}
    class:has-icon-right={iconRight !== undefined}
    {...props}
>
    {#if iconLeft !== undefined}
        <IconSvg icon={iconLeft} />
    {/if}
    {#if children}
        {@render children()}
    {/if}
    {#if iconRight !== undefined}
        <IconSvg icon={iconRight} />
    {/if}
</button>

<style lang="scss">
    @use "sass:color";
    @use "/static/colors.scss";

    button {
        height: fit-content;
        position: relative;
        padding: 0.5rem 1rem;
        border-radius: 0.25rem;
        font-weight: bold;
        color: var(--dark-1);
        cursor: pointer;
        font-size: 1rem;
        display: flex;
        flex-direction: row;
        align-items: center;
        gap: 0.5rem;
        text-wrap: nowrap;

        $bg-color: colors.$orange;
        background-color: $bg-color;
        --icon-stroke: var(--dark-1);

        &:hover {
            background-color: color.adjust($bg-color, $lightness: 15%);
        }

        &.has-icon-left {
            padding-left: 0.5rem;
        }

        &.has-icon-right {
            padding-right: 0.5rem;
        }

        &.disabled {
            cursor: none;
            pointer-events: none;
            opacity: 50%;
        }

        &.secondary {
            $bg-color: colors.$dark-3;
            background-color: var(--dark-3);
            color: var(--light-1);
            --icon-stroke: var(--light-3);

            &:hover {
                background-color: color.adjust($bg-color, $lightness: 15%);
            }
        }

        &.ghost {
            $bg-color: colors.$dark-2;
            background-color: initial;
            color: var(--light-1);
            --icon-stroke: var(--light-3);
            padding: 0;

            &:hover {
                background-color: color.adjust($bg-color, $lightness: 15%);
            }
        }
    }
</style>
