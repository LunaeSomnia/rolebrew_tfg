<script lang="ts">
    let { children, ...props } = $props();
</script>

<div class="row">
    {@render children(props)}
</div>

<style lang="scss">
    div {
        width: 100%;
        gap: 0;
    }
</style>
