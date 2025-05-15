<script>
    import GeneralInfoHeader from "$lib/components/GeneralInfoHeader.svelte";
    import { linkToLinkPreviewConverter } from "$lib/textProcessing";

    let { spell } = $props();
</script>

<div class="spellbook-item-desc column">
    <GeneralInfoHeader
        name={spell.name}
        publication={spell.publication}
        rarity={spell.rarity}
        traits={spell.traits}
    />

    <p class="description column">
        {@html linkToLinkPreviewConverter(spell.description)}
    </p>
</div>

<style>
    .spellbook-item-desc {
        flex: 1;
    }
</style>
