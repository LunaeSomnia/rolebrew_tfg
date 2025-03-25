<script lang="ts">
    import type { PageProps } from "./$types";
    import Tag from "$lib/components/Tag.svelte";
    import { getColorByCategory } from "$lib/color_category";
    import TableOfContents from "$lib/components/tableOfContents/TableOfContents.svelte";
    import AncestryStat from "./AncestryStat.svelte";
    import AncestryFeature from "./AncestryFeature.svelte.svelte";
    import { afterNavigate } from "$app/navigation";
    import {
        linkToLinkPreviewConverter,
        transformDescription,
    } from "$lib/textProcessing";
    import IconSvg from "$lib/icons/IconSVG.svelte";
    import { Icon } from "$lib/icons/icons";
    import Button from "$lib/components/Button.svelte";
    import LinkPreviewCe from "$lib/components/LinkPreviewCE.svelte";
    import Tooltip from "$lib/components/Tooltip.svelte";
    import SortedTable from "$lib/components/SortedTable.svelte";
    import { PUBLIC_BACKEND_URL } from "$env/static/public";
    import { CompendiumSection } from "$lib/compendiumTableDef";

    let { data }: PageProps = $props();

    let heritageTab = $state(0);

    afterNavigate(() => {
        heritageTab = 0;
    });

    function selectHeritageTab(index: number) {
        heritageTab = index;
    }

    async function fetchFeats() {
        const params = new URLSearchParams();
        params.append("has_traits", data.ancestry_id);

        return await (
            await fetch(
                PUBLIC_BACKEND_URL + "/api/feat/summary?" + params.toString(),
            )
        ).json();
    }
</script>

<div class="ancestry-wrapper row">
    <aside class="column side-data">
        <!-- <img
            src="/{data.ancestryData.img.replace('systems/pf2e/', '')}"
            alt=""
        /> -->
        <div class="column stats compact">
            <AncestryStat label="Hit Points" layout="row" spacing="0.5rem">
                <Tooltip text="Health">
                    <IconSvg icon={Icon.Health} fill="var(--red)" />
                </Tooltip>
                <p>{data.ancestryData.hp.toString()}</p>
            </AncestryStat>
            <AncestryStat label="Speed" layout="column" spacing="0.5rem">
                <div class="speed-row row">
                    <Tooltip text="Speed">
                        <IconSvg icon={Icon.Speed} fill="var(--green)" />
                    </Tooltip>
                    <p>{data.ancestryData.speed.walk + " feet"}</p>
                </div>
                {#if data.ancestryData.speed.swim !== null}
                    <div class="speed-row row">
                        <Tooltip text="Swim">
                            <IconSvg icon={Icon.Swim} fill="var(--blue)" />
                        </Tooltip>
                        <p>{data.ancestryData.speed.swim + " feet"}</p>
                    </div>
                {/if}
            </AncestryStat>
            <AncestryStat label="Size" layout="row" spacing="0.5rem">
                <Tooltip text="Size">
                    <IconSvg icon={Icon.Size} fill="var(--orange)" />
                </Tooltip>
                {data.ancestryData.size}
            </AncestryStat>
            <AncestryStat label="Boosts">
                <ul>
                    {#each (data.ancestryData.boosts ?? []).flatMap( (v: any) => {
                            switch (v.type) {
                                case "grant":
                                    return v.att;
                                case "choose":
                                    return v.atts;
                                case "free":
                                    return "Free";
                            }
                        }, ) as element}
                        <li>{element}</li>
                    {/each}
                </ul>
            </AncestryStat>
            <AncestryStat label="Senses"
                ><p style="text-transform: capitalize;">
                    {data.ancestryData.vision}
                </p></AncestryStat
            >
            <AncestryStat label="Languages">
                <ul class="m-4">
                    {#each data.ancestryData.languages.value as element}
                        <li style="text-transform: capitalize;">{element}</li>
                    {/each}
                </ul>
                <p class="m-3">
                    {"Additional languages equal to your Intelligence modifier (if positive)" +
                        (data.ancestryData.additionalLanguages.count == 0
                            ? ""
                            : ` + ${data.ancestryData.additionalLanguages.value.toString()}`)}
                </p>
                <ul>
                    {#each data.ancestryData.additionalLanguages.value as element}
                        <li style="text-transform: capitalize;">{element}</li>
                    {/each}
                </ul>
            </AncestryStat>
        </div>
    </aside>
    <div id="toc-target" class="main-content column">
        <section class="column general-info">
            <div class="header row spaced-between">
                <h2 id={data.ancestry_id}>
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
                    <Button
                        type="button"
                        class={i === heritageTab ? "primary" : "secondary"}
                        onclick={() => selectHeritageTab(i)}
                    >
                        {heritage.name
                            .replace(data.ancestryData.name, "")
                            .trim()}
                    </Button>
                {/each}
            </div>
            <div class="column heritages-content">
                {#each data.ancestryData.heritage ?? [] as heritage, i}
                    {#if i === heritageTab}
                        <div class="column heritage">
                            <span class="fake-h">{heritage.name}</span>
                            {#if heritage.traits?.length !== 0}
                                <div class="traits row">
                                    {#each heritage.traits ?? [] as trait}
                                        <Tag>
                                            {trait}
                                        </Tag>
                                    {/each}
                                </div>
                            {/if}
                            {@html linkToLinkPreviewConverter(
                                transformDescription(heritage.description),
                            )}
                        </div>
                    {/if}
                {/each}
            </div>
        </section>
        <section class="column feats">
            <h2 id="feats">Feats</h2>
            {#await fetchFeats() then featsData}
                <SortedTable
                    tableData={featsData}
                    compendiumSection={CompendiumSection.Feat}
                    selectedRowSlug={""}
                    includePreviews={true}
                    altBackground={true}
                />
            {/await}
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
        width: 100%;
        border-radius: 0.5rem;
        gap: 0.125rem;
        overflow: hidden;
    }

    .heritage {
        width: 100%;
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

    .speed-row {
        gap: 0.5rem;
    }
</style>
