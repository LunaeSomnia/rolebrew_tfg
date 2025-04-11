<script lang="ts">
    let { value = $bindable() }: { value: number } = $props();

    function onClick(i: number) {
        if (i >= value) {
            value++;
        } else if (i < value) {
            value--;
        }

        // Clamp
        if (value > 3) {
            value = 3;
        } else if (value < 0) {
            value = 0;
        }
    }
</script>

<div class="row hero-points">
    {#each Array(3) as _, i}
        <!-- svelte-ignore a11y_consider_explicit_label -->
        <button onclick={() => onClick(i)} class:active={i < value}></button>
    {/each}
</div>

<style lang="scss">
    .hero-points {
        gap: 0.5rem;
    }

    button {
        width: 1.5rem;
        height: 1.5rem;
        border-radius: 1rem;
        cursor: pointer;
        background-color: unset;
        border: 0.125rem solid var(--orange);

        &:hover {
            border-color: var(--orange-lighter);
        }

        &.active {
            background-color: var(--orange);

            &:hover {
                background-color: var(--orange-lighter);
            }
        }
    }
</style>
