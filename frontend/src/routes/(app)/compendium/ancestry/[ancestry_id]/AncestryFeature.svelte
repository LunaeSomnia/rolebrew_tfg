<script lang="ts">
    import type { Feat } from "$lib/bindings";
    import { getColorByCategory } from "$lib/color_category";
    import Tag from "$lib/components/Tag.svelte";
    import { transformDescription } from "$lib/textProcessing";

    let { feature }: { feature: Feat } = $props();
</script>

<div class="column ancestry-feature">
    <span class="fake-h">
        {feature.name}
    </span>
    <div class="traits row">
        <Tag color={getColorByCategory("rarity", feature.rarity)}>
            {feature.rarity}
        </Tag>
        {#each feature.traits ?? [] as trait}
            <Tag>
                {trait}
            </Tag>
        {/each}
    </div>
    <p class="column">{@html transformDescription(feature.description)}</p>
</div>

<style lang="scss">
    .ancestry-feature {
        width: 100%;
        padding: 1rem;
        background-color: var(--dark-3);
        border-radius: 0.5rem;
    }

    .traits {
        gap: 0.5rem;
    }
</style>
