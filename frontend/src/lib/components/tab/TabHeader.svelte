<script lang="ts">
    import Button from "../Button.svelte";

    let { active = $bindable(false), children, ...props } = $props();
</script>

<Button class="tabheader {!active ? 'secondary' : ''}" {...props}>
    {@render children()}
</Button>

<style lang="scss">
    :global(.tabheader) {
        border-radius: 0;
        flex: 1;
        padding: 0.5rem 0;
    }
</style>
