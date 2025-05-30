<script lang="ts">
    import type { PageProps } from "./$types";
    import Tag from "$lib/components/Tag.svelte";
    import { getColorByCategory } from "$lib/color_category";
    import TableOfContents from "$lib/components/tableOfContents/TableOfContents.svelte";
    import AncestryStat from "./AncestryStat.svelte";
    import AncestryFeature from "./AncestryFeature.svelte";
    import { afterNavigate, goto } from "$app/navigation";
    import {
        linkToLinkPreviewConverter,
        transformDescription,
    } from "$lib/textProcessing";
    import IconSvg from "$lib/icons/IconSVG.svelte";
    import { Icon } from "$lib/icons/icons";
    import Button from "$lib/components/Button.svelte";
    import LinkPreviewCe from "$lib/components/link-preview/LinkPreviewCE.svelte";
    import Tooltip from "$lib/components/Tooltip.svelte";
    import SortedTable from "$lib/components/SortedTable.svelte";
    import { CompendiumSection } from "$lib/compendiumTableDef";
    import Traits from "$lib/components/Traits.svelte";
    import GeneralInfoHeader from "$lib/components/GeneralInfoHeader.svelte";

    let { data }: PageProps = $props();

    let heritageTab = $state("");

    afterNavigate(() => {
        heritageTab = "";
    });

    function afterLoad() {
        goto("#" + data.ancestry_id);
    }

    function selectHeritageTab(heritage: string) {
        heritageTab = heritage;
    }
</script>

{#await data.ancestryRequest then ancestry}
    {afterLoad()}
    <div class="ancestry row">
        <aside class="column side-data">
            <!-- <img
            src="/{ancestry.img.replace('systems/pf2e/', '')}"
            alt=""
        /> -->
            <div class="column stats compact">
                <AncestryStat label="Hit Points" layout="row" spacing="0.5rem">
                    <Tooltip text="Health">
                        <IconSvg icon={Icon.Health} fill="var(--red)" />
                    </Tooltip>
                    <p>{ancestry.hp.toString()}</p>
                </AncestryStat>
                <AncestryStat label="Speed" layout="column" spacing="0.5rem">
                    <div class="speed-row row" style="gap: 0.5rem;">
                        <Tooltip text="Speed">
                            <IconSvg icon={Icon.Speed} fill="var(--green)" />
                        </Tooltip>
                        <p>{ancestry.speed.walk + " feet"}</p>
                    </div>
                    {#if ancestry.speed.swim !== null}
                        <div class="speed-row row" style="gap: 0.5rem;">
                            <Tooltip text="Swim">
                                <IconSvg icon={Icon.Swim} fill="var(--blue)" />
                            </Tooltip>
                            <p>{ancestry.speed.swim + " feet"}</p>
                        </div>
                    {/if}
                </AncestryStat>
                <AncestryStat label="Size" layout="row" spacing="0.5rem">
                    <Tooltip text="Size">
                        <IconSvg icon={Icon.Size} fill="var(--orange)" />
                    </Tooltip>
                    {ancestry.size}
                </AncestryStat>
                <AncestryStat label="Boosts">
                    <ul>
                        {#each (ancestry.boosts ?? []).flatMap((v: any) => {
                            switch (v.type) {
                                case "grant":
                                    return v.att;
                                case "choose":
                                    return v.atts;
                                case "free":
                                    return "Free";
                            }
                        }) as element}
                            <li>{element}</li>
                        {/each}
                    </ul>
                </AncestryStat>
                <AncestryStat label="Senses"
                    ><p style="text-transform: capitalize;">
                        {ancestry.vision}
                    </p></AncestryStat
                >
                <AncestryStat label="Languages">
                    <ul class="m-4">
                        {#each ancestry.languages.value as element}
                            <li style="text-transform: capitalize;">
                                {element}
                            </li>
                        {/each}
                    </ul>
                    <p class="m-3">
                        {"Additional languages equal to your Intelligence modifier (if positive)" +
                            (ancestry.additionalLanguages.count == 0
                                ? ""
                                : ` + ${ancestry.additionalLanguages.value.toString()}`)}
                    </p>
                    <ul>
                        {#each ancestry.additionalLanguages.value as element}
                            <li style="text-transform: capitalize;">
                                {element}
                            </li>
                        {/each}
                    </ul>
                </AncestryStat>
            </div>
        </aside>
        <div id="toc-target" class="main-content column">
            <section class="column general-info">
                <GeneralInfoHeader
                    id={data.ancestry_id}
                    name={ancestry.name}
                    publication={ancestry.publication}
                    rarity={ancestry.rarity}
                    traits={ancestry.traits}
                />

                <p class="description fancy column">
                    {@html transformDescription(ancestry.description.summary)}
                </p>

                {#if ancestry.features?.length !== 0}
                    <div class="column features">
                        {#each ancestry.features ?? [] as feature}
                            <AncestryFeature {feature} />
                        {/each}
                    </div>
                {/if}
            </section>

            <section class="column heritages">
                <h2 id="heritages">Heritages</h2>
                <div class="column" style="gap: 1rem; width: 100%;">
                    <div class="row heritages-header">
                        {#each ancestry.heritages ?? [] as heritage, i}
                            <Button
                                cta={heritage.uuid === heritageTab
                                    ? "primary"
                                    : "secondary"}
                                onclick={() => selectHeritageTab(heritage.uuid)}
                            >
                                {heritage.name
                                    .replace(ancestry.name, "")
                                    .trim()}
                            </Button>
                        {/each}
                    </div>
                    <div class="column heritages-content">
                        {#await fetch(`/api/heritage/${heritageTab}`).then( (v) => v.json(), ) then heritage}
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
                        {/await}
                    </div>
                </div>
            </section>
            <section class="column feats">
                <h2 id="feats">Feats</h2>
                {#await data.ancestryFeatsRequest then featsData}
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
                <h2 id="roleplaying-the-{ancestry.slug}" style="margin-top: 0;">
                    Roleplaying the {ancestry.name}
                </h2>
                {@html ancestry.description.roleplaying}
            </section>
        </div>
        <TableOfContents />
    </div>
{/await}

<style lang="scss">
    .side-data {
        min-width: 202px;
        width: 202px;
        height: 20rem;
    }

    .ancestry {
        width: 100%;
        max-width: 100%;
        gap: 2rem;
    }

    section {
        width: 100%;
        border-radius: 0.5rem;
        padding: 2rem;
        background-color: var(--dark-2);
        gap: 2rem;
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

    .side-data {
        height: auto;

        & > * {
            width: 100%;
            border-radius: 0.5rem;
            overflow: hidden;
            height: auto;
        }

        // img {
        //     background-color: var(--dark-2);
        //     padding: 1rem;
        // }
    }

    .features {
        width: 100%;
    }
</style>
