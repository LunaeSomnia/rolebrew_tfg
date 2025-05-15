<script lang="ts">
    import { Icon } from "$lib/icons/icons";
    import IconSvg from "$lib/icons/IconSVG.svelte";
    import Button from "./Button.svelte";

    let {
        value = $bindable(""),
        placeholder = "Search here",
    }: { value: string; placeholder?: string } = $props();
</script>

<div class="searchbox" class:has-input={value !== ""}>
    <input class="row" bind:value type="text" {placeholder} />
    <div class="left-overlay">
        <IconSvg icon={Icon.Search} />
    </div>
    <div class="right-overlay">
        <Button
            cta="ghost"
            iconLeft={Icon.Close}
            onclick={() => (value = "")}
        />
    </div>
</div>

<style lang="scss">
    .searchbox {
        width: 100%;
        position: relative;
        background-color: var(--dark-3);
        overflow: hidden;
        border-radius: 0.5rem;

        input {
            height: 2.5rem;
            padding: 1rem;
            padding-left: 2.5rem;
            background-color: var(--dark-3);
            color: var(--light-1);
            font-size: 1rem;
        }

        &.has-input input {
            font-weight: 600;
        }

        .left-overlay {
            position: absolute;
            top: 0.5rem;
            left: 0.5rem;
            pointer-events: none;
            width: 1.5rem;
            height: 1.5rem;

            --icon-color: var(--light-3);
        }
        .right-overlay {
            position: absolute;
            top: 0.5rem;
            left: calc(100% - 0.5rem);
            width: 1.5rem;
            height: 1.5rem;
            transform: translate(-100%, 0%);
            opacity: 0;
            pointer-events: none;

            --icon-color: var(--light-2);
        }

        &.has-input .right-overlay {
            opacity: 1;
            pointer-events: all;
        }
    }

    :global(.right-overlay .button) {
        width: 1.5rem;
        min-width: 1.5rem;
        height: 1.5rem;
    }
</style>
