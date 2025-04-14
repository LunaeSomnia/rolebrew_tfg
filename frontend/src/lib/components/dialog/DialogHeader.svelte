<script lang="ts">
    let { title } = $props();
</script>

<!-- svelte-ignore element_invalid_self_closing_tag -->
<h5 class="title row">{title}<span class="divider" /></h5>

<style lang="scss">
    .title {
        align-items: center;
    }
    .divider {
        height: 0.125rem;
        flex: 1;
        background-color: var(--dark-3);
    }
</style>
