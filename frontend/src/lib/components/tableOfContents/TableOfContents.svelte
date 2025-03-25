<script lang="ts">
    import { onMount, tick } from "svelte";
    import {
        buildTOCTree,
        treeToArrayTOC,
        type TOCNode,
    } from "./tableOfContents";
    import { afterNavigate } from "$app/navigation";

    let tocTree: TOCNode | null = $state(null);

    let target;
    let headers: NodeListOf<Element>;
    let headingOffsets: TOCNode[];
    let scrollPos = $state(0);
    let activeId = $state("");

    function updateTOC() {
        // Get all the headers (h1 to h6)
        target = document.querySelector("#toc-target");
        if (target) {
            headers = target.querySelectorAll("h2, h3, h4, h5, h6");

            tocTree = buildTOCTree(headers, target);
            headingOffsets = treeToArrayTOC(tocTree);
        } else {
            tocTree = null;
        }
    }

    function onScroll() {
        if (!headingOffsets) return;
        scrollPos = window.scrollY; // Check when heading reaches the middle of the viewport
        for (let i = headingOffsets.length - 1; i >= 0; i--) {
            if (scrollPos >= headingOffsets[i].top) {
                activeId = headingOffsets[i].id;
                break;
            }
        }
    }

    afterNavigate(() => {
        updateTOC();
    });

    onMount(() => {
        updateTOC();
    });

    $effect(() => {
        // Add scroll event listener
        window.addEventListener("scroll", onScroll);
        tick().then(updateTOC);
    });
</script>

{#snippet tableOfContentNode(node: TOCNode)}
    <a
        href="#{node.id}"
        class="no-accent no-decoration"
        class:active={node.id === activeId}
        class:past={node.id !== activeId && node.top < scrollPos}>{node.text}</a
    >
    <div class="toc-separator">
        {#each node.children as tocNode}
            {@render tableOfContentNode(tocNode)}
        {/each}
    </div>
{/snippet}

<aside class="column">
    <p class="tag">On this page</p>
    <div>
        {#if tocTree}
            {#each tocTree.children as tocNode}
                {@render tableOfContentNode(tocNode)}
            {/each}
        {/if}
    </div>
</aside>

<style lang="scss">
    aside {
        min-width: 202px;
        width: 202px;
        height: 20rem;
        position: sticky;
        top: 6rem;
        scroll-margin-top: 4rem;
    }

    .toc-separator {
        border-left: 0.125rem solid var(--dark-2);
        margin-left: 0.125rem;
        margin-top: 0.5rem;
        padding-left: 1rem;
    }

    a {
        color: var(--light-2);

        &.active {
            color: var(--orange);
        }

        &.past {
            color: var(--orange-darker);
        }
    }
</style>
