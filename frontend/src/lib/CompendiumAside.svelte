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
</script>

<aside class="column">
    <div class="column aside-group">
        <span class="tag">For the Users</span>
        <div class="column aside-group-inner">
            {#each forTheUsers as [link, header]}
                <a
                    class="no-accent no-decoration"
                    class:active={compendiumSection === link}
                    href="{HREF_BASE}{link}/"
                    data-sveltekit-preload-data={false}
                >
                    {header}</a
                >
            {/each}
        </div>
    </div>
    <div class="column aside-group">
        <span class="tag">For Everyone</span>
        <div class="column aside-group-inner">
            <a class="no-accent no-decoration" href="{HREF_BASE}action/"
                >Actions</a
            >
            <a class="no-accent no-decoration" href="{HREF_BASE}archetypes/"
                >Conditions</a
            >
            <a class="no-accent no-decoration" href="{HREF_BASE}archetypes/"
                >Items</a
            >
            <a class="no-accent no-decoration" href="{HREF_BASE}archetypes/"
                >Traits</a
            >
        </div>
    </div>
    <div class="aside-group column">
        <span class="tag">For the DMs</span>
        <div class="column aside-group-inner">
            <a class="no-accent no-decoration" href="{HREF_BASE}archetypes/"
                >Bestiary</a
            >
            <a class="no-accent no-decoration" href="{HREF_BASE}archetypes/"
                >Quick Reference</a
            >
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
