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
