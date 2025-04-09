<script lang="ts">
    let {
        label,
        id,
        children,
        ...props
    } = $props();
</script>

<div {id} class="column feature-card" {...props} style="grid-area: {id};">
    <span class="tag small">{label}</span>
    <div class="column feature-card-content">
        {@render children()}
    </div>
</div>

<style lang="scss">
    .feature-card {
        height: 100%;
        background-color: var(--dark-1);
        padding: 1rem;
        border-radius: 0.5rem;
    }

    .feature-card-content {
        gap: 0.5rem;
        color: var(--light-1);
    }
</style>
