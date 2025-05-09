<script lang="ts">
    let {
        min = $bindable(),
        max = $bindable(),
        value = $bindable(),
        step,
    }: {
        min: number;
        max?: number;
        value: number;
        step?: number;
    } = $props();
</script>

<div class="slider-wrapper">
    <input type="range" {min} {max} {step} bind:value class="slider" />
</div>

<style lang="scss">
    .slider-wrapper {
        width: 100%;
        min-width: 20rem;
    }

    .slider {
        -webkit-appearance: none;
        appearance: none;
        background: transparent;
        cursor: pointer;
        min-width: 10rem;
        width: 100%;
        padding: 0;
        align-items: center;
        height: 0.5rem;
        transition: all var(--transition-quick);
    }

    /***** Chrome, Safari, Opera and Edge Chromium styles *****/
    /* slider track */
    .slider::-webkit-slider-runnable-track {
        background-color: var(--orange-darker);
        border-radius: 0.5rem;
        height: 0.5rem;
        transition: all var(--transition-quick);
    }

    /* slider thumb */
    .slider::-webkit-slider-thumb {
        -webkit-appearance: none;
        appearance: none;
        margin-top: -0.25rem;
        border-radius: 0.5rem;
        outline: 0 solid var(--orange-lighter);
        outline-offset: 0.125rem;
        transition: all var(--transition-quick);
        background-color: var(--orange);
        height: 1rem;
        width: 1rem;
    }

    .slider:hover::-webkit-slider-thumb {
        background-color: var(--orange-lighter);
    }

    .slider:focus::-webkit-slider-thumb {
        outline-width: 0.125rem;
        background-color: var(--orange-lighter);
    }

    /******** Firefox styles ********/
    /* slider track */
    .slider::-moz-range-track {
        background-color: var(--orange-darker);
        border-radius: 0.5rem;
        height: 0.5rem;
        transition: all var(--transition-quick);
    }

    /* slider thumb */
    .slider::-moz-range-thumb {
        border: none; /*Removes extra border that FF applies*/
        background-color: var(--orange);
        height: 1rem;
        width: 1rem;
        outline: 0 solid var(--orange-lighter);
        outline-offset: 0.125rem;
        transition: all var(--transition-quick);
    }

    .slider:hover::-moz-range-thumb {
        background-color: var(--orange-lighter);
    }

    .slider:focus::-moz-range-thumb {
        outline-width: 0.125rem;
        background-color: var(--orange-lighter);
    }
</style>
