<script lang="ts">
    import type { Publication } from "$lib/bindings";
    import Tag from "./Tag.svelte";
    import Traits from "./Traits.svelte";

    let {
        id,
        name,
        publication,
        rarity,
        traits,
    }: {
        id?: string;
        name: string;
        publication: Publication;
        rarity?: string;
        traits?: string[];
    } = $props();
</script>

<div class="general-info">
    <div class="header row spaced-between">
        <h2 {id}>
            {name}
        </h2>
        <div class="meta row">
            <p class="id">{publication.title}</p>
            <Tag>
                <p class="license">
                    {publication.license}
                </p>
            </Tag>
        </div>
    </div>
    <Traits {rarity} {traits} />
</div>

<style lang="scss">
    .general-info {
        width: 100%;

        h2 {
            width: auto;
        }
    }
</style>
