<script lang="ts">
    import type { Snippet } from "svelte";

    let { color = "neutral", children }: { color?: string; children: Snippet } =
        $props();
</script>

<span
    class="small tag"
    style="--tag-bg: var(--{color}-darker); --tag-color: var(--{color}-lighter);"
>
    {@render children()}
</span>

<style lang="scss">
    span {
        height: 1.5rem;
        width: fit-content;
        padding: 0.25rem 0.5rem;
        display: grid;
        place-items: center;
        border-radius: 0.25rem;
        background-color: var(--tag-bg);

        text-align: center;
        color: var(--tag-color);
    }
</style>
