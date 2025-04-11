<script>
    import { Icon } from "$lib/icons/icons";
    import IconSvg from "$lib/icons/IconSVG.svelte";
    import Button from "../Button.svelte";

    let { currentHp = $bindable(), totalHp, tempHp = $bindable() } = $props();
</script>

<div class="card row hp">
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
    <Button
        cta="secondary"
        onclick={() => console.log("hp")}
        iconLeft={Icon.Math}
    ></Button>
</div>

<style lang="scss">
    .hp {
        padding: 1rem;
        color: var(--light-3);

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
