<script lang="ts">
    import Dice from "../Dice.svelte";

    let {
        roll,
        dice,
        excluded = false,
    }: {
        roll: number;
        dice: number;
        excluded?: boolean;
    } = $props();
</script>

<div class="dice-roll {excluded}">
    <Dice {dice} {excluded} />
    <span class="value">{roll}</span>
</div>

<style lang="scss">
    .dice-roll {
        position: relative;
        width: 2.5rem;
        min-width: 2.5rem;
        height: 2.5rem;
        min-height: 2.5rem;
        border-radius: 0.5rem;
        overflow: hidden;
    }

    .value {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        color: var(--dark-1);
        font-weight: bold;
    }
</style>
