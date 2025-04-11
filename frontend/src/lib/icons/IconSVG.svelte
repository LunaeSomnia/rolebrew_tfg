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
    style={!iconDefinition?.isStroke
        ? fill
            ? "--icon-color: " + fill
            : ""
        : ""}
>
    {#each iconDefinition?.d ?? [] as iconDef}
        {#if iconDefinition?.isStroke}
            <path
                fill-rule={DEFAULT_ICON_FILL_RULE}
                clip-rule={DEFAULT_ICON_CLIP_RULE}
                d={iconDef}
                fill="none"
                stroke="var(--icon-color)"
                stroke-width="var(--icon-stroke-width)"
            />
        {:else}
            <path
                fill-rule={DEFAULT_ICON_FILL_RULE}
                clip-rule={DEFAULT_ICON_CLIP_RULE}
                d={iconDef}
                fill="var(--icon-color)"
            />
        {/if}
    {/each}
</svg>

<style lang="scss">
</style>
