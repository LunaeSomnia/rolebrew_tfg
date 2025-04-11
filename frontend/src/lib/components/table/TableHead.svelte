<script lang="ts">
    import { TableSorting, type TableHeaderDef } from "$lib/compendiumTableDef";
    import { Icon } from "$lib/icons/icons";
    import IconSvg from "$lib/icons/IconSVG.svelte";
    import type { HTMLThAttributes } from "svelte/elements";

    let {
        data,
        sortingData,
        ...props
    }: HTMLThAttributes & { data: TableHeaderDef; sortingData: TableSorting } =
        $props();
</script>

<th {...props} class:active={sortingData !== TableSorting.None}>
    <span>
        {data.column}
    </span>
    <div class="overlay">
        {#if sortingData === TableSorting.Ascending}
            <IconSvg icon={Icon.ChevronUp} />
        {:else if sortingData === TableSorting.Descending}
            <IconSvg icon={Icon.ChevronDown} />
        {/if}
    </div>
</th>

<style lang="scss">
    th {
        position: relative;
        height: 1.25rem;
        background-color: var(--dark-3);
        padding: 0.5rem;
        text-align: start;
        cursor: pointer;
        user-select: none;

        .overlay {
            position: absolute;
            left: calc(100% - 0.5rem);
            top: 0.5rem;
            transform: translate(-100%, 0%);
            width: 1.5rem;
            height: 1.5rem;

            --icon-color: var(--light-1);
        }

        &:hover {
            background: color-mix(
                in hsl shorter hue,
                #{var(--dark-3)},
                #{var(--light-3)} 20%
            );
        }

        &.active {
            color: var(--light-1);
            background: color-mix(
                in hsl shorter hue,
                #{var(--dark-3)},
                #{var(--dark-4)} 50%
            );
        }
    }
</style>
