<script lang="ts">
    let { children, ...props } = $props()
</script>

<div class="column card" {...props}>
    <div class="column wrapper">
        {@render children()}
    </div>
</div>

<style lang="scss">
    .card {
        width: 100%;
        height: 100%;
        gap: 1rem;
        overflow-y: auto;
    }

    .wrapper {
        width: 100%;
        height: 0;
        flex-grow: 1;
    }
</style>
