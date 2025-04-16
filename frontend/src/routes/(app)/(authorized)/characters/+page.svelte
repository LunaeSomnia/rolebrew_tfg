<script lang="ts">
    import { goto } from "$app/navigation";
    import type { Character } from "$lib/bindings.js";
    import Button from "$lib/components/Button.svelte";
    import CharacterCard from "$lib/components/CharacterCard.svelte";
    import Searchbox from "$lib/components/Searchbox.svelte";
    import { Icon } from "$lib/icons/icons.js";
    import IconSvg from "$lib/icons/IconSVG.svelte";

    let { data } = $props();

    let charactersSearch = $state("");

    function onNewCharacter() {
        goto("characters/new");
    }
</script>

<div class="characters column">
    <div class="header row spaced-between">
        <h1>Characters</h1>
        <div class="row">
            <Searchbox
                placeholder="Search in characters"
                bind:value={charactersSearch}
            />
            <Button onclick={onNewCharacter} iconLeft={Icon.Plus}>
                Create Character
            </Button>
        </div>
    </div>

    {#await data.charactersRequest then characters}
        {#if characters.length === 0}
            <div class="no-characters column">
                <p>Seems like you have no characters</p>
                <Button
                    cta="secondary"
                    onclick={onNewCharacter}
                    iconLeft={Icon.Plus}
                >
                    <span>Create Character</span>
                </Button>
            </div>
        {:else}
            <div class="row characters-wrapper">
                {#each characters as character}
                    <CharacterCard {character} />
                {/each}
            </div>
        {/if}
    {/await}
</div>

<style lang="scss">
    .characters {
        width: 100%;
        height: 100%;

        .header {
            width: 100%;
            align-items: flex-end;

            h1 {
                width: auto;
            }

            & > .row {
                width: fit-content;
            }
        }

        .no-characters {
            width: 100%;
            height: 100%;

            align-items: center;
            justify-content: center;
        }

        .characters-wrapper {
            flex-wrap: wrap;
        }
    }
</style>
