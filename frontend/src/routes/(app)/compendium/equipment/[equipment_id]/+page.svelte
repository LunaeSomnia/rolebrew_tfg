<script lang="ts">
    import type { PageProps } from "./$types";
    import TableOfContents from "$lib/components/tableOfContents/TableOfContents.svelte";
    import Tag from "$lib/components/Tag.svelte";
    import { getColorByCategory } from "$lib/color_category";
    import { linkToLinkPreviewConverter } from "$lib/textProcessing";
    import { onMount } from "svelte";
    import LinkPreviewCE from "$lib/components/link-preview/LinkPreviewCE.svelte";
    import Traits from "$lib/components/Traits.svelte";

    let { data }: PageProps = $props();
</script>

<div class="ancestry-wrapper row">
    <aside class="column side-data"></aside>
    <div id="toc-target" class="main-content column">
        <section class="column general-info">
            <div class="header row spaced-between">
                <h2 id={data.action_id}>
                    {data.equipmentData.name}
                </h2>
                <div class="meta row">
                    <p class="id">{data.equipmentData.publication.title}</p>
                    <Tag>
                        <p class="license">
                            {data.equipmentData.publication.license}
                        </p>
                    </Tag>
                </div>
            </div>
            <Traits
                rarity={data.equipmentData.rarity}
                traits={data.equipmentData.traits}
            />

            <p class="description column">
                {@html linkToLinkPreviewConverter(
                    data.equipmentData.description,
                )}
            </p>
        </section>
    </div>
    <TableOfContents />
</div>

<style lang="scss">
    .side-data {
        min-width: 202px;
        width: 202px;
        height: 20rem;
    }

    .ancestry-wrapper {
        width: 100%;
        max-width: 100%;
        gap: 2rem;
    }
    .main-content {
        width: calc(100% - 4rem - 2 * 202px);
        .header {
            width: 100%;
        }
        gap: 2rem;
    }

    section {
        width: 100%;
        border-radius: 0.5rem;
        padding: 2rem;
        background-color: var(--dark-2);
        gap: 2rem;
    }
</style>
