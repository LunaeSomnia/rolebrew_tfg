<script lang="ts">
    let {
        value = $bindable(),
        onclick: onclickswitch,
    }: { value: boolean; onclick: () => void } = $props();

    function onclick() {
        value = !value;
        onclickswitch();
    }
</script>

<button class="switch {value ? 'active' : ''}" {onclick} aria-label="switch">
    <!-- svelte-ignore element_invalid_self_closing_tag -->
    <div class="handle" />
</button>

<style>
    .switch {
        position: relative;
        min-width: 2rem;
        width: 2rem;
        height: 1rem;
        min-height: 1rem;
        background-color: var(--dark-1);
        border-radius: 0.5rem;
        z-index: 10;
        transition: background-color var(--transition-normal);

        &:hover .handle {
            background-color: var(--light-2);
        }

        &.active {
            background-color: var(--orange);

            &:hover {
                background-color: var(--orange-lighter);
            }

            & > .handle {
                left: 1.125rem;
                background-color: var(--dark-1);
            }
        }
    }

    .handle {
        position: absolute;
        left: 0.125rem;
        top: 0.125rem;
        width: 0.75rem;
        height: 0.75rem;
        border-radius: 0.5rem;
        background-color: var(--dark-4);
        transition:
            all var(--transition-normal),
            background-color var(--transition-normal);
    }
</style>
