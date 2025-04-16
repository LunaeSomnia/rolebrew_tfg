<script lang="ts">
    import type { Action } from "$lib/bindings";
    import LinkPreview from "$lib/components/link-preview/LinkPreview.svelte";
    import { Icon } from "$lib/icons/icons";
    import IconSvg from "$lib/icons/IconSVG.svelte";
    import { hrefToSummaryHref } from "$lib/textProcessing";

    let {
        action,
    }: {
        action: Action;
    } = $props();

    let icon = $derived.by(() => {
        if (action.actionType === "reaction") {
            return Icon.Reaction;
        }
        switch (action.actions) {
            case 1:
                return Icon.Action;
            case 2:
                return Icon.DoubleAction;
            case 3:
                return Icon.TripleAction;
            default:
            case 0:
                return Icon.FreeAction;
        }
    });

    let href = `/compendium/action/${action.slug}`;
    let summaryHref = hrefToSummaryHref(href);
</script>

<LinkPreview {href} {summaryHref}>
    <span class="row action-card">{action.name} <IconSvg {icon} /></span>
</LinkPreview>

<style lang="scss">
    :global(.action-card) {
        padding: 0.5rem 1rem;
        background-color: var(--dark-3);
        border-radius: 0.5rem;
        color: var(--light-1);
        --icon-color: var(--light-3);
        gap: 0.5rem;
        transition: all var(--transition-normal);
        user-select: none;

        &:hover {
            --icon-color: var(--light-2);
            background-color: var(--dark-4);
        }
    }

    :global(.actions a) {
        text-decoration: none !important;
    }
</style>
