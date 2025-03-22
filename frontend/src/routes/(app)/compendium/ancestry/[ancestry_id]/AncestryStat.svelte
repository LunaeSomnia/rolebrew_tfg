<script lang="ts">
    import type { Snippet } from "svelte";

    type Props = {
        label: string;
        layout?: "column" | "row";
        spacing?: string;
        children: Snippet;
    };
    let {
        label,
        layout = "column",
        spacing = "1rem",
        children,
    }: Props = $props();
</script>

<div class="column ancestry-stat">
    <span class="tag">{label}</span>
    <div class={layout} style="gap: {spacing};">
        {@render children()}
    </div>
</div>

<style lang="scss">
    .ancestry-stat {
        width: 100%;
        background-color: var(--dark-2);
        padding: 1rem;
        gap: 1rem;
        height: auto;
    }

    span {
        color: var(--light-3);
    }
</style>
