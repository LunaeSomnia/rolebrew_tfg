<script lang="ts">
    import { getColorByCategory } from "$lib/color_category";
    import Tag from "./Tag.svelte";

    let { rarity, traits } = $props();
</script>

<div class="traits row">
    {#if rarity}
        <Tag color={getColorByCategory("rarity", rarity)}>
            {rarity}
        </Tag>
    {/if}
    {#each traits ?? [] as trait}
        <Tag>
            {trait}
        </Tag>
    {/each}
</div>

<style lang="scss">
    .traits {
        gap: 0.5rem;
        flex-wrap: wrap;
        width: 100%;
    }
</style>
