<script lang="ts">
    import {
        DEFAULT_ICON_CLIP_RULE,
        DEFAULT_ICON_FILL,
        DEFAULT_ICON_FILL_RULE,
        DEFAULT_ICON_SIZE,
        DEFAULT_ICON_VIEWPORT_HEIGHT,
        DEFAULT_ICON_VIEWPORT_WIDTH,
        ICON_VALUES,
        type Icon,
    } from "./icons";

    type Props = {
        icon: Icon;
        fill?: string;
        size?: number | string;
    };

    let { icon, size = DEFAULT_ICON_SIZE, fill }: Props = $props();

    const iconDefinition = ICON_VALUES.get(icon);
</script>

<svg
    width={size ?? DEFAULT_ICON_SIZE}
    height={size ?? DEFAULT_ICON_SIZE}
    viewBox={`0 0 ${
        iconDefinition?.iconViewportSize ?? DEFAULT_ICON_VIEWPORT_WIDTH
    } ${iconDefinition?.iconViewportSize ?? DEFAULT_ICON_VIEWPORT_HEIGHT}`}
    xmlns="http://www.w3.org/2000/svg"
    style={fill ? "--icon-stroke: " + fill : ""}
>
    {#each iconDefinition?.d ?? [] as iconDef}
        {#if iconDefinition?.isStroke}
            <path
                fill-rule={DEFAULT_ICON_FILL_RULE}
                clip-rule={DEFAULT_ICON_CLIP_RULE}
                d={iconDef}
                stroke-width="0.125rem"
            />
        {:else}
            <path
                fill-rule={DEFAULT_ICON_FILL_RULE}
                clip-rule={DEFAULT_ICON_CLIP_RULE}
                d={iconDef}
            />
        {/if}
    {/each}
</svg>

<style lang="scss">
    path {
        stroke: var(--icon-stroke);
        stroke-width: var(--icon-stroke-width);
        fill: var(--icon-fill);
    }
</style>
