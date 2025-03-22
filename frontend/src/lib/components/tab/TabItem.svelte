<script lang="ts">
    let { active, children, ...props } = $props();
</script>

{#if active}
    <div class="column">
        {@render children(props)}
    </div>
{/if}

<style lang="scss">
    div {
        padding: 1rem;
    }
</style>
