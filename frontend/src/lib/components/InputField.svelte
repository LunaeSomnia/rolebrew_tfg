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
