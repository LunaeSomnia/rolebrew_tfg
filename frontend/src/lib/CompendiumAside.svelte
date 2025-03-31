<script lang="ts">
    const HREF_BASE = "/compendium/";

    let { compendiumSection }: { compendiumSection: string } = $props();

    const forTheUsers = [
        ["ancestry", "Ancestries"],
        ["archetype", "Archetypes"],
        ["background", "Backgrounds"],
        ["class", "Classes"],
        ["feat", "Feats"],
        ["spell", "Spells"],
    ];

    const forEveryone = [
        ["action", "Actions"],
        ["condition", "Conditions"],
        ["item", "Items"],
        ["trait", "Traits"],
    ];

    const forDms = [
        ["bestiary", "Bestiary"],
        ["quick-reference", "Quick Reference"],
    ];
</script>

{#snippet reference(link: string, header: string)}
    <a
        class="no-accent no-decoration"
        class:active={compendiumSection === link}
        href="{HREF_BASE}{link}/"
        data-sveltekit-preload-data={false}
    >
        {header}</a
    >
{/snippet}

<aside class="column">
    <div class="column aside-group">
        <span class="tag">For the Users</span>
        <div class="column aside-group-inner">
            {#each forTheUsers as [link, header]}
                {@render reference(link, header)}
            {/each}
        </div>
    </div>
    <div class="column aside-group">
        <span class="tag">For Everyone</span>
        <div class="column aside-group-inner">
            {#each forEveryone as [link, header]}
                {@render reference(link, header)}
            {/each}
        </div>
    </div>
    <div class="aside-group column">
        <span class="tag">For the DMs</span>
        <div class="column aside-group-inner">
            {#each forDms as [link, header]}
                {@render reference(link, header)}
            {/each}
        </div>
    </div>
</aside>

<style lang="scss">
    aside {
        width: 12.625rem;
        height: 100%;
    }

    a.active {
        color: var(--orange);
    }

    .aside-group {
        gap: 1rem !important;
    }

    .aside-group-inner {
        gap: 0.5rem !important;
    }

    .column {
        gap: 2rem;
    }
</style>
