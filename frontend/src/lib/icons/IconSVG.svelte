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
        size?: number;
        fill?: string;
    };

    let {
        icon,
        size = DEFAULT_ICON_SIZE,
        fill = DEFAULT_ICON_FILL,
    }: Props = $props();
</script>

<svg
    width={size}
    height={size}
    viewBox={`0 0 ${DEFAULT_ICON_VIEWPORT_WIDTH} ${DEFAULT_ICON_VIEWPORT_HEIGHT}`}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
>
    {#each ICON_VALUES.get(icon)?.d ?? [] as iconDef}
        <path
            fill-rule={DEFAULT_ICON_FILL_RULE}
            clip-rule={DEFAULT_ICON_CLIP_RULE}
            d={iconDef}
            {fill}
        />
    {/each}
</svg>
