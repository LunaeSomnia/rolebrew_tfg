<script lang="ts">
    let {
        value = $bindable(""),
        placeholder = "Input here",
        onkeydown,
        onchange,
        ...props
    }: {
        value: string;
        placeholder: string;
        onkeydown?: (e: KeyboardEvent) => void;
        onchange?: () => void;
    } & any = $props();
</script>

<!-- svelte-ignore a11y_no_static_element_interactions -->
<!-- <div class="input-field" class:has-input={value !== ""} {onkeydown} {onchange}> -->
<textarea
    class="input-field"
    class:has-input={value !== ""}
    bind:value
    {placeholder}
    {...props}
></textarea>

<!-- </div> -->

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
    }
    textarea {
        resize: none;
        min-height: 2.5rem;
        width: 100%;
        height: auto;
        background-color: unset;
        color: inherit;
        overflow-y: auto;
        padding: 1rem;

        &::placeholder {
            color: inherit;
        }
    }
</style>
