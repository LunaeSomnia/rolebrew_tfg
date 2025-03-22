<script lang="ts">
    let { active = $bindable(false), children, ...props } = $props();
</script>

<button class:secondary={!active} {...props}>
    {@render children()}
</button>

<style lang="scss">
    button {
        border-radius: 0;
        flex: 1;
        padding: 0.5rem 0;
    }
</style>
