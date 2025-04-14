<script>
    import { Icon } from "$lib/icons/icons";
    import IconSvg from "$lib/icons/IconSVG.svelte";
    import Button from "../Button.svelte";
    import Dialog from "../dialog/Dialog.svelte";
    import DialogHeader from "../dialog/DialogHeader.svelte";
    import InputField from "../InputField.svelte";
    import Popover from "../Popover.svelte";
    import Slider from "../Slider.svelte";

    let { currentHp = $bindable(), totalHp, tempHp = $bindable() } = $props();

    let damageValue = $state(0);
    let healValue = $state(0);

    function onClickDamage() {
        if (tempHp > damageValue) {
            tempHp -= damageValue;
        } else if (tempHp !== 0 && tempHp < damageValue) {
            let leftover = damageValue - tempHp;
            tempHp = 0;
            currentHp -= leftover;
        } else {
            currentHp -= damageValue;
        }
    }

    function onClickHeal() {
        currentHp += healValue;

        if (currentHp > totalHp) {
            currentHp = totalHp;
        }
    }
</script>

<div class="card row hp-card">
    <div class="row stat hp-wrapper">
        <div class="row health">
            <IconSvg icon={Icon.Health} />
            <span class="value">{currentHp}</span>
            <span>/</span>
            <span>{totalHp}</span>
        </div>
        <div class="row temp" class:disabled={tempHp === 0}>
            <IconSvg icon={Icon.Health} />
            <span class="value">{tempHp}</span>
        </div>
    </div>

    {#snippet popoverHeader()}
        <Button cta="secondary" onclick={() => {}} iconLeft={Icon.Math}
        ></Button>
    {/snippet}

    <Dialog title="Modify HP" headerSnippet={popoverHeader}>
        <div class="row stat hp-wrapper" style="width: 100%;">
            <div class="row health" style="flex: 1;">
                <IconSvg icon={Icon.Health} />
                <span class="value">{currentHp}</span>
                <span>/</span>
                <span>{totalHp}</span>
            </div>
            <div class="row temp" class:disabled={tempHp === 0}>
                <IconSvg icon={Icon.Health} />
                <span class="value">{tempHp}</span>
            </div>
        </div>
        <div class="hp-dialog column">
            <div class="column" style="width: 100%; ">
                <DialogHeader title="Actions" />
                <div class="column" style="width: 100%; gap: 0.5rem;">
                    <h6>Damage</h6>
                    <div class="row">
                        <InputField
                            type="number"
                            bind:value={damageValue}
                            min={0}
                        />
                        <Button
                            class="hp-dialog-damage-button"
                            onclick={onClickDamage}>Damage</Button
                        >
                    </div>
                    <h6>Heal</h6>
                    <div class="row">
                        <InputField
                            type="number"
                            bind:value={healValue}
                            min={0}
                        />
                        <Button
                            class="hp-dialog-heal-button"
                            onclick={onClickHeal}>Heal</Button
                        >
                    </div>
                </div>
            </div>
            <div class="column" style="width: 100%; ">
                <DialogHeader title="Manual Set" />
                <div class="column" style="width: 100%; gap: 0.5rem;">
                    <h6>HP</h6>
                    <div class="row" style="width: 100%; align-items: center;">
                        <Slider bind:value={currentHp} min={0} max={totalHp} />
                        <InputField bind:value={currentHp} type="number" />
                    </div>
                </div>
                <div class="column" style="width: 100%; gap: 0.5rem;">
                    <h6>Temp HP</h6>
                    <div
                        class="row"
                        style="width: 100%; align-items: center;  gap: 0.5rem;"
                    >
                        <InputField bind:value={tempHp} type="number" />
                    </div>
                </div>
            </div>
        </div>
    </Dialog>
</div>

<style lang="scss">
    :global(.hp-dialog-damage-button) {
        background-color: var(--red) !important;
    }
    :global(.hp-dialog) {
        width: 100%;
        gap: 2rem;

        .row,
        .column {
            width: 100%;
        }
    }

    .hp-card {
        width: 20rem;
        padding: 1rem;
        color: var(--light-3);
    }

    :global(.hp-wrapper) {
        width: 100%;
        .health {
            flex: 1;
            gap: 0.5rem;
            --icon-color: var(--red);
        }

        .temp {
            gap: 0.5rem;
            --icon-color: var(--purple);
            padding-right: 0.5rem;

            &.disabled {
                opacity: 0.5;
            }
        }

        .hp-wrapper {
            flex: 1;
            padding: 0.5rem;
            gap: 2rem;
        }

        .value {
            color: var(--light-1);
            font-weight: bold;
        }
    }
</style>
