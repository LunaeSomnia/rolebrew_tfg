<script lang="ts">
    import { type Proficiency } from "$lib/bindings";

    let {
        proficiency,
    }: {
        proficiency: Proficiency;
    } = $props();
</script>

<span class="proficiency {proficiency.toLowerCase()} tag">{proficiency[0]}</span
>

<style lang="scss">
    .proficiency {
        width: 1.25rem;
        min-width: 1.25rem;
        height: 1.25rem;
        min-height: 1.25rem;
        text-align: center;
        align-content: center;
        font-size: 0.75rem;
        border-radius: 1rem;

        &.untrained {
            background-color: var(--dark-3);
            color: var(--light-1);
        }

        &.trained {
            background-color: var(--blue);
            color: var(--light-1);
        }

        &.expert {
            background-color: var(--red);
            color: var(--dark-1);
        }

        &.master {
            background-color: var(--purple);
            color: var(--dark-1);
        }

        &.legendary {
            background-color: var(--orange);
            color: var(--dark-1);
        }
    }
</style>
