<script lang="ts">
    import Portal from "svelte-portal";
    import { cubicOut } from "svelte/easing";
    import { fly } from "svelte/transition";

    let { floatingContent, openPreview, closePreview, children } = $props();
</script>

<!-- svelte-ignore a11y_no_static_element_interactions -->
<Portal target="body">
    <div
        class="link-preview"
        use:floatingContent
        transition:fly|global={{
            duration: 200,
            y: 8,
            easing: cubicOut,
        }}
        onmouseenter={openPreview}
        onmouseleave={closePreview}
    >
        <div class="wrapper column">
            {@render children()}
        </div>
    </div>
</Portal>

<style lang="scss">
    .link-preview {
        width: 100%;
        max-width: 40rem;
        position: absolute;
        display: flex;
        border-width: 1px;
        background-color: var(--dark-1);
        border-radius: 0.5rem;
        border: solid 0.125rem var(--dark-2);
        transition: position 0ms;
        box-shadow: 0rem 0rem 4rem #00000088;
        z-index: 999;
    }

    .wrapper {
        position: relative;
        overflow-y: auto;
        max-height: 30rem;
        padding: 1.5rem;
    }
</style>
