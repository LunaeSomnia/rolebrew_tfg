<script lang="ts">
    let {
        value = $bindable(""),
        placeholder = "Input here",
        ...props
    } = $props();
</script>

<div class="input-field" class:has-input={value !== ""}>
    <input class="row" bind:value {placeholder} {...props} />
</div>

<style lang="scss">
    .input-field {
        width: 100%;
        position: relative;
        background-color: var(--dark-1);
        border-radius: 0.5rem;
        border: 0;

        &.has-input {
            background-color: var(--dark-3);
        }
    }
    input {
        width: 100%;
        height: 2.5rem;
        padding: 1rem;
        background-color: transparent;
        color: var(--light-1);
        font-size: 1rem;
        border: 0;
        border-radius: 0.5rem;
        transition: all var(--transition-normal);
        outline-color: transparent;
        outline-style: solid;
        outline-width: 0.125rem;

        &:focus-visible {
            background-color: var(--dark-1);
            outline-color: var(--orange-darker);
            box-shadow: 0rem 0rem 1rem #00000044;
        }
    }
</style>
