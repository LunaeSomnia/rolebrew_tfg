<script lang="ts">
    import { goto } from "$app/navigation";
    import { Icon } from "$lib/icons/icons";
    import {
        linkToLinkPreviewConverter,
        transformDescription,
    } from "$lib/textProcessing";
    import Button from "../Button.svelte";
    import Select from "../Select.svelte";
    import Tooltip from "../Tooltip.svelte";
    import type { Choice, DecisionTree } from "./characterCreator.svelte";

    let {
        label,
        from,
        decision = $bindable(),
        value = $bindable(),
        allDecisionsMade = $bindable(decision.choices.length === 0),
    }: {
        label: string;
        from: string;
        decision: DecisionTree;
        value: Choice[];
        allDecisionsMade: boolean;
    } = $props();

    function onSelect(selectDecision: DecisionTree, idx: number, e: Event) {
        // @ts-ignore
        const setValue = e.target.value as string;

        const choice = selectDecision.choices.find((v) => v.value === setValue);
        if (!choice)
            throw new Error("selected choice doesnt exist: " + setValue);
        value[idx] = choice;

        if (value.length > idx + 1) {
            for (let i = 0; i < value.length - idx; i++) {
                value.pop();
            }
        }

        allDecisionsMade = value.length > 0;
        allDecisionsMade &&= choice?.subDecisions.length === 0;
    }
</script>

{#snippet decisionSnippet(decision: DecisionTree, idx: number)}
    {@const choiceSelected = value[idx]}
    <div class="column" style="gap: 0.5rem; width: 100%;">
        {#if decision.choices}
            <div class="column input-group">
                <div class="row spaced-between">
                    <span class="tag small">{decision.label}</span>
                </div>
                <Select
                    onselect={(e) => onSelect(decision, idx, e)}
                    choices={decision.choices}
                    placeholder={decision.label}
                />
            </div>
        {/if}

        {#if choiceSelected}
            {#if choiceSelected && choiceSelected.compendiumType && choiceSelected.compendiumType !== "skill"}
                {#await fetch(`/api/${choiceSelected.compendiumType}/${choiceSelected.value}`).then( (v) => v.json(), ) then fetchedItem}
                    {#if fetchedItem !== null && "description" in fetchedItem}
                        <p
                            class="card column"
                            style="background-color: var(--dark-3); padding: 1rem; width: 100%;"
                        >
                            {@html linkToLinkPreviewConverter(
                                transformDescription(fetchedItem.description),
                            )}
                            <Tooltip text="Compendium Source">
                                <Button
                                    cta="ghost"
                                    iconLeft={Icon.Logo}
                                    onclick={() =>
                                        goto(
                                            `/compendium/${choiceSelected.compendiumType}/${choiceSelected.value}`,
                                        )}
                                />
                            </Tooltip>
                        </p>
                    {/if}
                {/await}
            {/if}
        {/if}
    </div>

    {#if value[idx]}
        {@const nextDecisions = decision.choices.find(
            (v) => v.value === value[idx].value,
        )}
        {#if nextDecisions}
            {#each nextDecisions.subDecisions as decision}
                {@render decisionSnippet(decision, idx + 1)}
            {/each}
        {/if}
    {/if}
{/snippet}

<div class="column decision-card">
    <div class="row spaced-between">
        <div class="row header">
            <h4>{label}</h4>
            <span>from {from}</span>
        </div>
    </div>
    {@render decisionSnippet(decision, 0)}
</div>

<style lang="scss">
    .decision-card {
        width: 100%;
        border: 0.125rem solid var(--dark-3);
        border-radius: 0.5rem;
        padding: 2rem;
        gap: 2rem;

        .header {
            align-items: baseline;

            span {
                color: var(--light-3);
            }

            h4 {
                width: auto;
            }
        }

        .input-group {
            width: 100%;
        }
    }
</style>
