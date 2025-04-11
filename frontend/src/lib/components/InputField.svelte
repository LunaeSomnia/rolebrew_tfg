<script lang="ts">
    let {
        value = $bindable(""),
        placeholder = "Input here",
        onkeydown,
        ...props
    }: {
        value: string;
        placeholder: string;
        onkeydown?: (e: KeyboardEvent) => void;
    } & any = $props();
</script>

<!-- svelte-ignore a11y_no_static_element_interactions -->
<div class="input-field" class:has-input={value !== ""} {onkeydown}>
    <input class="row" bind:value {placeholder} {...props} />
</div>

<style lang="scss">
    .input-field {
        width: 100%;
        position: relative;
        background-color: var(--dark-1);
        border-radius: 0.5rem;
        border: 0;
        color: var(--light-3);

        &.has-input {
            background-color: var(--dark-3);
            color: var(--light-1);
        }

        input {
            color: inherit;

            &::placeholder {
                color: inherit;
            }
        }
    }
</style>
