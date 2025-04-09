<script lang="ts">
    import type { PageProps } from "./$types";
    import TableOfContents from "$lib/components/tableOfContents/TableOfContents.svelte";
    import {
        linkToLinkPreviewConverter,
        transformDescription,
    } from "$lib/textProcessing";
    import GeneralInfoHeader from "$lib/components/GeneralInfoHeader.svelte";

    let { data }: PageProps = $props();
</script>

<div class="ancestry-wrapper row">
    <aside class="column side-data"></aside>
    <div class="main-content column">
        <section class="column general-info">
            <GeneralInfoHeader
                id={data.class_id}
                name={data.classData.name}
                publication={data.classData.publication}
                rarity={data.classData.rarity}
                traits={data.classData.traits}
            />

            <p class="description column">
                {@html linkToLinkPreviewConverter(
                    transformDescription(data.classData.description),
                )}
            </p>
        </section>
        <section id="toc-target" class="column features">
            {#each data.classData.features ?? [] as feature}
                <h2>{feature.name}</h2>
                <p class="description column">
                    {@html linkToLinkPreviewConverter(
                        transformDescription(feature.description),
                    )}
                </p>
            {/each}
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
