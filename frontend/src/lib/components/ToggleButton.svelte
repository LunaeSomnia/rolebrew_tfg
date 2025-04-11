<script lang="ts">
    import type { Icon } from "$lib/icons/icons";
    import IconSvg from "$lib/icons/IconSVG.svelte";
    import type { Snippet } from "svelte";
    import Button from "./Button.svelte";

    let {
        children,
        disabled = false,
        class: classData,
        iconLeft,
        iconRight,
        value = $bindable(),
        ...props
    }: {
        children?: Snippet;
        disabled?: boolean;
        class?: string;
        iconLeft?: Icon;
        iconRight?: Icon;
        value: boolean;
    } = $props();
</script>

<Button
    cta={value ? "primary" : "secondary"}
    {disabled}
    class={classData}
    {iconLeft}
    {iconRight}
    {children}
    onclick={() => (value = !value)}
/>
