<script lang="ts">
    import type { ComponentProps } from "svelte";
    import { Slider, type WithoutChildren } from "bits-ui";

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

<!--
 Since we have to destructure the `value` to make it `$bindable`, we need to use `as any` here to avoid
 type errors from the discriminated union of `"single" | "multiple"`.
 (an unfortunate consequence of having to destructure bindable values)
  -->
<div class="slider-wrapper">
    <Slider.Root
        bind:value
        class="slider"
        type="single"
        {step}
        {min}
        max={max ?? 256}
    >
        {#snippet children({ thumbs, ticks })}
            <Slider.Range class="slider-range" />
            {#each thumbs as index}
                <Slider.Thumb {index} class="slider-thumb" />
            {/each}

            <div class="ticks row">
                {#if max}
                    {#each ticks as index}
                        <Slider.Tick
                            {index}
                            class="slider-tick"
                            style="position: relative !important; "
                        />
                    {/each}
                {/if}
            </div>
        {/snippet}
    </Slider.Root>
</div>

<!-- {#snippet children()}
    <span class="slider-range-wrapper">
        <Slider.Range class="slider-range" />
    </span>
    <Slider.Thumb index={0} class={cn("slider-thumb")} />
{/snippet} -->

<style lang="scss">
    .slider-wrapper {
        width: 100%;
        min-width: 20rem;
    }

    :global(.ticks) {
        position: absolute;
        height: 0.5rem;
        width: 100%;
        margin: 0;
        border: 0;
        padding: 0 0.5rem;
        gap: 0;
        justify-content: space-between;
    }

    :global(.slider-tick) {
        width: 0.125rem;
        height: 100%;
        background-color: var(--dark-2);
        left: 0 !important;
        right: 0 !important;
        position: relative !important;
        translate: unset !important;
        transform: translate(-50%);
    }

    :global(.slider) {
        display: grid;
        position: relative;
        align-items: center;
        width: 100%;
        touch-action: none;
        user-select: none;
        min-width: 20rem;
        height: 1rem;
    }

    :global(.slider-range-wrapper) {
        overflow: hidden;
        position: relative;
        border-radius: 9999px;
        width: 100%;
        height: 0.5rem;
        cursor: pointer;
        background-color: var(--light-3);
    }

    :global(.slider-range) {
        position: absolute;
        height: 100%;
        overflow: hidden;
        position: relative;
        border-radius: 9999px;
        right: unset !important;
        width: 100%;
        height: 0.5rem;
        cursor: pointer;
        background-color: var(--orange-darker);
    }

    :global(.slider-thumb) {
        display: block;
        border-radius: 9999px;
        border-width: 1px;
        width: 1rem;
        height: 1rem;
        transition: background-color var(--transition-quick);
        cursor: pointer;
        box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
        background-color: var(--orange);
        z-index: 1;

        :hover {
            background-color: var(--orange-lighter);
        }
    }
</style>
