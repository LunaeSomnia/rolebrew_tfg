<script lang="ts">
    let { children, ...props } = $props();
</script>

<div class="column">
    {@render children(props)}
</div>

<style lang="scss">
    div {
        width: 100%;
        background-color: var(--dark-3);
    }
</style>
