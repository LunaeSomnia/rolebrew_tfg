<script lang="ts">
    import type { Attribute } from "$lib/bindings";
    import { Icon } from "$lib/icons/icons";
    import Button from "../Button.svelte";
    import Select from "../Select.svelte";
    import {
        AbilityScoreMethod,
        rollAbilityScores,
        type RollResult,
    } from "./abilityScoreCreation";
    import DiceRoll from "./DiceRoll.svelte";

    let {
        allChosen = $bindable(false),
        value = $bindable(),
    }: {
        allChosen: boolean;
        value: Record<Attribute, number>;
    } = $props();

    const abilityScoreMethods = [
        AbilityScoreMethod.Standard,
        AbilityScoreMethod.Classic,
        AbilityScoreMethod.Heroic,
        AbilityScoreMethod.DicePool,
    ];

    const attributes: Attribute[] = [
        "Strength",
        "Dexterity",
        "Constitution",
        "Intelligence",
        "Wisdom",
        "Charisma",
    ];

    let abilityScoreMethod: AbilityScoreMethod | undefined = $state();
    let rolledAbilityScores = $state<RollResult[] | undefined>();
    let abilityScores = $state<Record<Attribute, number>>();

    let chosenAttributes = $state<(Attribute | undefined)[]>([]);

    function onRollAbilityScoreMethod() {
        if (abilityScoreMethod) {
            rolledAbilityScores = rollAbilityScores(abilityScoreMethod);
            if (abilityScoreMethod !== AbilityScoreMethod.DicePool) {
                chosenAttributes = new Array(6).fill(undefined);
            }
        }
    }

    function onSelectAttribute(e: Event, i: number, roll: RollResult) {
        // @ts-ignore
        const setValue = e.target.value as string as Attribute;

        const findVIdx = chosenAttributes.findIndex((v) => v === setValue);
        if (findVIdx !== -1) {
            chosenAttributes[findVIdx] = undefined;
        }

        let changed = [...chosenAttributes];
        changed[i] = setValue;

        chosenAttributes = changed;

        allChosen =
            chosenAttributes.filter((v) => v === undefined).length === 0 &&
            rolledAbilityScores !== undefined;
        value[setValue] = roll.total;
    }
</script>

<div class="row" style="align-items: flex-end; width: 100%;">
    <div class="column input-group level" style="width: 100%;">
        <span class="tag small">Ability score creation method</span>
        <Select
            bind:value={abilityScoreMethod}
            choices={abilityScoreMethods.map((v) => {
                return {
                    value: v.toString(),
                    label: v.toString(),
                };
            })}
            placeholder="Ability Score Creation Method"
        />
    </div>
    <Button
        cta="primary"
        iconLeft={Icon.Dice}
        disabled={abilityScoreMethod === undefined}
        onclick={onRollAbilityScoreMethod}
    ></Button>
</div>
<div class="column rolls" style="width: 100%;">
    {#if rolledAbilityScores}
        {#each Object.entries(rolledAbilityScores) as [attribute, rollResult], i}
            <div class="row roll">
                {#each rollResult.rolls as roll, j}
                    {#if j !== 0}
                        <span>+ </span>
                    {/if}
                    <DiceRoll
                        dice={roll.dice}
                        roll={roll.value}
                        excluded={roll.excluded}
                    />
                {/each}
                <span>=</span>
                <span class="roll-total">{rollResult.total}</span>
                <div class="selector"></div>
                <Select
                    placeholder="Attribute"
                    value={chosenAttributes[i]}
                    choices={attributes.map((v) => {
                        return {
                            label: v.toString(),
                            value: v.toString(),
                        };
                    })}
                    onselect={(e) => onSelectAttribute(e, i, rollResult)}
                />
            </div>
        {/each}
    {/if}
</div>

<style lang="scss">
    .rolls {
        .roll {
            align-items: center;
            width: 100%;
            gap: 0.5rem;

            .roll-total {
                text-wrap: nowrap;
                color: var(--light-1);
                font-weight: 600;
                width: 2rem;
                min-width: 2rem;
            }

            .selector {
                flex: 1;
            }
        }
    }
</style>
