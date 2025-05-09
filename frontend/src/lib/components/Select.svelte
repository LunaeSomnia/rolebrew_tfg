<script lang="ts">
    import { Icon } from "$lib/icons/icons";
    import { capitalize } from "$lib/utils";
    import type { EventHandler } from "svelte/elements";

    type Choice = { label: string; value: string; disabled?: boolean };

    let {
        choices = $bindable(),
        placeholder,
        value = $bindable(),
        iconLeft,
        onselect,
    }: {
        choices: Choice[];
        placeholder: string;
        value?: string;
        iconLeft?: Icon;
        onselect?: EventHandler<Event, HTMLSelectElement> | null | undefined;
    } = $props();

    let open = $state(false);

    const selectedLabel = $derived(
        value
            ? choices.find((choice: any) => choice.value === value)?.label
            : placeholder,
    );
</script>

<select
    class="select-trigger"
    class:has-value={value !== undefined}
    bind:value
    onchange={onselect}
>
    <option value={undefined} disabled>{placeholder}</option>
    {#each choices as choice}
        <option value={choice.value} disabled={choice.disabled}
            >{capitalize(choice.label)}</option
        >
    {/each}
</select>

<!-- <Select.Root
    type="single"
    onValueChange={(v) => (value = v)}
    items={choices}
    bind:open
>
    <Select.Trigger
        class="select-trigger {iconLeft !== undefined ? 'has-icon-left' : ''}"
        aria-label={placeholder}
    >
        {#if iconLeft !== undefined}
            <IconSvg icon={iconLeft} />
        {/if}
        <span class="select-trigger-text" class:has-value={value !== undefined}
            >{selectedLabel}</span
        >
        <IconSvg icon={open ? Icon.ChevronUp : Icon.ChevronDown} />
    </Select.Trigger>
    <Select.Portal>
        <Select.Content class="select-content dialog" sideOffset={8}>
            <Select.ScrollUpButton class=".scroll-wrapper">
                <IconSvg icon={Icon.ChevronUp} fill="var(--light-1)" />
            </Select.ScrollUpButton>
            <Select.Viewport class="select-viewport">
                {#each choices as choice, i (i + choice.value)}
                    <Select.Item
                        class="select-item"
                        value={choice.value}
                        label={choice.label}
                    >
                        {#snippet children({ selected })}
                            {choice.label}
                            {#if selected}
                                <div class="ml-auto">
                                    <IconSvg icon={Icon.Check} />
                                </div>
                            {/if}
                        {/snippet}
                    </Select.Item>
                {/each}
            </Select.Viewport>
            <Select.ScrollDownButton class=".scroll-wrapper">
                <IconSvg icon={Icon.ChevronDown} fill="var(--light-1)" />
            </Select.ScrollDownButton>
        </Select.Content>
    </Select.Portal>
</Select.Root> -->

<style>
    :global(.scroll-wrapper) {
        display: flex;
        width: 100%;
        align-items: center;
        justify-content: center;
    }

    :global(.select-trigger) {
        position: relative;
        width: 100%;
        height: 2.5rem;
        padding: 0.5rem;
        display: inline-flex;

        border-radius: 0.5rem;
        overflow: hidden;
        align-items: center;
        background-color: var(--dark-3);
        /* border: 0.125rem solid var(--dark-3);
        background-color: unset; */
        font-size: 1rem;
        user-select: none;
        gap: 0.5rem;
        cursor: pointer;
        color: var(--light-1);

        &:disabled {
            color: var(--light-3);
        }

        :global(.select-item) {
            color: var(--light-1);

            &:disabled {
                color: var(--light-3);
            }
        }

        &.has-value {
            background-color: var(--dark-3);
        }

        --icon-color: var(--light-3);

        &.has-icon-left {
            padding-left: 0.5rem;
        }
    }

    :global(.select-trigger-text) {
        width: 100%;
        text-align: start;
        color: var(--light-3);
        &.has-value {
            color: var(--light-1);
        }
    }

    :global(.select-content) {
        z-index: 50;
        padding: 0.25rem;
        border-radius: 0.75rem;
        border-width: 1px;
        outline-style: hidden;
        max-height: 24rem;
        user-select: none;
        max-height: var(--bits-select-content-available-height);
        width: var(--bits-select-anchor-width);
        gap: 0;
    }

    :global(.select-viewport) {
        padding: 0.25rem;
        width: 100%;
        overflow-y: auto;
    }

    :global(.select-item) {
        display: flex;
        align-items: center;
        width: 100%;
        height: 2.5rem;
        padding: 0.25rem 0.5rem;
        user-select: none;
        border-radius: 0.5rem;
        color: var(--light-2);
        cursor: pointer;

        &:hover {
            color: var(--light-1);
            background-color: var(--dark-2);
        }
    }
</style>
