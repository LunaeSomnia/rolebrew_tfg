<script lang="ts">
    import type { Character } from "$lib/bindings";
    import { capitalize } from "$lib/utils";

    let { character }: { character: Character } = $props();

    // @ts-ignore
    let id = $derived(character._id.$oid);
</script>

<a class="card column character" href="/characters/{id}">
    <span class="name">{character.name}</span>
    <span
        ><span class="ancestry">{capitalize(character.ancestry)}</span>
        <span class="class">{capitalize(character.class)}</span>, {character.level}</span
    >
</a>

<style lang="scss">
    .character {
        text-decoration: none;

        &:hover {
            background-color: var(--dark-3);
        }

        .name {
            font-weight: 600;
            color: var(--light-1);
            width: 20rem;
            min-height: 20rem;
        }
    }
</style>
