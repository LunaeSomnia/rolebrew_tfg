<script lang="ts">
    import type { Icon } from "$lib/icons/icons";
    import IconSvg from "$lib/icons/IconSVG.svelte";
    import Tooltip from "../Tooltip.svelte";

    let {
        icon,
        text,
        tooltip,
    }: {
        icon: Icon;
        text: string;
        tooltip: string;
    } = $props();
</script>

<Tooltip text={tooltip}>
    <div class="row stat">
        <IconSvg {icon} />
        <span>{text}</span>
    </div>
</Tooltip>

<style lang="scss">
    :global(.stat) {
        padding: 0.5rem;
        padding-right: 1rem;
        background-color: var(--dark-1);
        --icon-color: var(--light-3);
        border-radius: 0.5rem;
        gap: 0.5rem;
    }

    :global(.stat > span) {
        color: var(--light-1);
        font-weight: 600;
        text-wrap: nowrap;
    }
</style>
