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
        background-color: var(--dark-3);
        overflow: hidden;
        border-radius: 0.5rem;
    }
    input {
        width: 100%;
        height: 2.5rem;
        padding: 1rem;
        background-color: none;
        background-color: var(--dark-3);
        color: var(--light-1);
        font-size: 1rem;
    }
</style>
