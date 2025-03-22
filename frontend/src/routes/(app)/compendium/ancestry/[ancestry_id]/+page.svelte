<script lang="ts">
    import { onMount } from "svelte";
    import type { PageProps } from "./$types";
    import Tag from "$lib/components/Tag.svelte";
    import { getColorByCategory } from "$lib/color_category";
    import TableOfContents from "$lib/components/tableOfContents/TableOfContents.svelte";
    import AncestryStat from "./AncestryStat.svelte";
    import TabItem from "$lib/components/tab/TabItem.svelte";
    import AncestryFeature from "./AncestryFeature.svelte.svelte";
    import { Button } from "bits-ui";
    import { afterNavigate } from "$app/navigation";
    import { transformDescription } from "$lib/textProcessing";

    let { data }: PageProps = $props();

    let heritageTab = $state(0);

    let titleElement: HTMLElement;

    afterNavigate(() => {
        heritageTab = 0;
    });

    function selectHeritageTab(index: number) {
        heritageTab = index;
    }
</script>

<div class="ancestry-wrapper row">
    <aside class="column side-data">
        <!-- <img
            src="/{data.ancestryData.img.replace('systems/pf2e/', '')}"
            alt=""
        /> -->
        <div class="column stats compact">
            <AncestryStat
                label="Hit Points"
                value={data.ancestryData.hp.toString()}
            />
            <AncestryStat
                label="Speed"
                value={data.ancestryData.speed.walk + " feet"}
            />
            <AncestryStat label="Size" value={data.ancestryData.size} />
            <AncestryStat
                label="Boosts"
                values={(data.ancestryData.boosts ?? []).flatMap((v: any) => {
                    switch (v.type) {
                        case "grant":
                            return v.att;
                        case "choose":
                            return v.atts;
                        case "free":
                            return "Free";
                    }
                })}
            />
            <AncestryStat label="Senses" value={data.ancestryData.vision} />
            <AncestryStat
                label="Languages"
                values={data.ancestryData.languages.value}
            />
            <AncestryStat
                label="Additional Languages"
                value={"Additional languages equal to your Intelligence modifier (if positive)" +
                    (data.ancestryData.additionalLanguages.count == 0
                        ? ""
                        : ` + ${data.ancestryData.additionalLanguages.value.toString()}`)}
                values={data.ancestryData.additionalLanguages.value}
            />
        </div>
    </aside>
    <div id="toc-target" class="main-content column">
        <section class="column general-info">
            <div class="header row spaced-between">
                <h2 bind:this={titleElement} id={data.ancestry_id}>
                    {data.ancestryData.name}
                </h2>
                <div class="meta row">
                    <p class="id">{data.ancestryData.publication.title}</p>
                    <Tag>
                        <p class="license">
                            {data.ancestryData.publication.license}
                        </p>
                    </Tag>
                </div>
            </div>
            <div class="traits row">
                <Tag
                    color={getColorByCategory(
                        "rarity",
                        data.ancestryData.rarity,
                    )}
                >
                    {data.ancestryData.rarity}
                </Tag>
                {#each data.ancestryData.traits ?? [] as trait}
                    <Tag>
                        {trait}
                    </Tag>
                {/each}
            </div>

            <p class="description fancy column">
                {@html transformDescription(
                    data.ancestryData.description.summary,
                )}
            </p>

            {#if data.ancestryData.features?.length !== 0}
                <div class="column features">
                    {#each data.ancestryData.features ?? [] as feature}
                        <AncestryFeature {feature} />
                    {/each}
                </div>
            {/if}
        </section>
        <section class="column heritages">
            <h2 id="heritages">Heritages</h2>
            <div class="row heritages-header">
                {#each data.ancestryData.heritage ?? [] as heritage, i}
                    <Button.Root
                        type="button"
                        class={i === heritageTab ? "primary" : "secondary"}
                        onclick={() => selectHeritageTab(i)}
                    >
                        {heritage.slug
                            // .replace(data.ancestryData.name, "")
                            .trim()}
                    </Button.Root>
                {/each}
            </div>
            <div class="column heritages-content">
                {#each data.ancestryData.heritage ?? [] as heritage, i}
                    {#if i === heritageTab}
                        <div class="column heritage">
                            <span class="fake-h">{heritage.slug}</span>
                            {#if heritage.traits?.length !== 0}
                                <div class="traits row">
                                    {#each heritage.traits ?? [] as trait}
                                        <Tag>
                                            {trait}
                                        </Tag>
                                    {/each}
                                </div>
                            {/if}
                            {#each heritage.description as desc}
                                {@html transformDescription(desc)}
                            {/each}
                        </div>
                    {/if}
                {/each}
            </div>
        </section>
        <section class="column roleplaying">
            <h2 id="roleplaying-the-{data.ancestryData.slug}">
                Roleplaying the {data.ancestryData.name}
            </h2>
            {@html data.ancestryData.description.roleplaying}
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

    .general-info {
        // .meta {
        // }

        h2 {
            width: auto;
        }

        .features {
            width: 100%;
            border-radius: 0.5rem;
            overflow: hidden;
            gap: 0.125rem;
        }
    }

    .heritages-header {
        flex-wrap: wrap;
    }

    .heritages-content {
        border-radius: 0.5rem;
        gap: 0.125rem;
        overflow: hidden;
    }

    .heritage {
        padding: 1rem;
        background-color: var(--dark-3);
    }

    .roleplaying {
        h2 {
            margin-top: 0;
        }
    }

    .traits {
        gap: 0.5rem;
    }

    .side-data {
        height: auto;

        & > * {
            width: 100%;
            border-radius: 0.5rem;
            overflow: hidden;
            height: auto;
        }

        img {
            background-color: var(--dark-2);
            padding: 1rem;
        }
    }
</style>
