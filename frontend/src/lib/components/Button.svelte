<script lang="ts">
    import type { Icon } from "$lib/icons/icons";
    import IconSvg from "$lib/icons/IconSVG.svelte";
    import type { Snippet } from "svelte";

    let {
        children,
        cta = "primary",
        disabled = false,
        class: classData,
        color = "orange",
        iconLeft,
        iconRight,
        onclick,
        fake = false,
    }: {
        children?: Snippet;
        cta?: "primary" | "secondary" | "ghost";
        disabled?: boolean;
        class?: string;
        color?:
            | "neutral"
            | "orange"
            | "blue"
            | "red"
            | "yellow"
            | "purple"
            | "green";
        iconLeft?: Icon;
        iconRight?: Icon;
        fake?: boolean;
        onclick: () => void;
    } = $props();
</script>

{#if fake}
    <div
        class="button row {cta} {classData}"
        class:disabled
        class:has-content={children !== undefined}
        class:has-icon-left={iconLeft !== undefined}
        class:has-icon-right={iconRight !== undefined}
        style="--accent-color: {color};"
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
    </div>
{:else}
    <button
        {onclick}
        class="button row {cta} {classData}"
        class:disabled
        class:has-content={children !== undefined}
        class:has-icon-left={iconLeft !== undefined}
        class:has-icon-right={iconRight !== undefined}
        style="--accent-color: var(--{color});"
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
{/if}

<style lang="scss">
    @use "sass:color";

    .button {
        position: relative;
        align-items: center;
        height: fit-content;
        border-radius: 0.25rem;
        padding: 0.5rem;
        border: 0;
        margin: 0;
        line-height: inherit;
        height: 2.5rem;
        min-width: 2.5rem;
        justify-content: center;

        font-family: inherit;
        font-weight: 600;
        letter-spacing: inherit;
        color: var(--dark-1);
        cursor: pointer;
        font-size: 1rem;
        gap: 0.5rem;
        text-wrap: nowrap;
        transition: all var(--transition-normal);

        &::after {
            content: "";
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            border-radius: 0.25rem;

            background-color: var(--light-1);
            opacity: 0;
            transition: all var(--transition-normal);
        }

        background-color: var(--accent-color);
        --icon-color: var(--dark-1);

        &:hover::after {
            opacity: 0.15;
            // background-color: color.adjust($bg-color, $lightness: 15%);
        }

        &.has-content {
            padding: 0.5rem 1rem;
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
            background-color: var(--dark-3);
            color: var(--light-1);
            --icon-color: var(--light-3);

            &:hover {
                --icon-color: var(--light-2);

                &::after {
                    opacity: 0.15;
                    // background-color: color.adjust($bg-color, $lightness: 15%);
                }
            }
        }

        &.ghost {
            background-color: initial;
            color: var(--light-1);
            --icon-color: var(--light-3);
            padding: 0;

            &:hover {
                // background-color: color.adjust($bg-color, $lightness: 15%);
                --icon-color: var(--light-2);

                &::after {
                    opacity: 0.15;
                }
            }
        }
    }
</style>
