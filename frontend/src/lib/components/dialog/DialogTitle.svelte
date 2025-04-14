<script lang="ts">
    let { children } = $props();
</script>

<div class="dialog-title">
    {@render children()}
</div>

<style lang="scss">
    .dialog-title {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 100%;
        font-size: 1.125rem;
        line-height: 1.75rem;
        font-weight: 600;
        letter-spacing: -0.025em;
    }
</style>
