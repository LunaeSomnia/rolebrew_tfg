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
        fake = false,
    }: {
        children?: Snippet;
        cta?: "primary" | "secondary" | "ghost";
        disabled?: boolean;
        class?: string;
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
    @use "/static/colors.scss";

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

        font-family: inherit;
        font-weight: bold;
        letter-spacing: inherit;
        color: var(--dark-1);
        cursor: pointer;
        font-size: 1rem;
        gap: 0.5rem;
        text-wrap: nowrap;

        $bg-color: colors.$orange;
        background-color: $bg-color;
        --icon-color: var(--dark-1);

        &:hover {
            background-color: color.adjust($bg-color, $lightness: 15%);
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
            $bg-color: colors.$dark-3;
            background-color: var(--dark-3);
            color: var(--light-1);
            --icon-color: var(--light-3);

            &:hover {
                background-color: color.adjust($bg-color, $lightness: 15%);
                --icon-color: var(--light-2);
            }
        }

        &.ghost {
            $bg-color: colors.$dark-2;
            background-color: initial;
            color: var(--light-1);
            --icon-color: var(--light-3);
            padding: 0;

            &:hover {
                background-color: color.adjust($bg-color, $lightness: 15%);
                --icon-color: var(--light-2);
            }
        }
    }
</style>
