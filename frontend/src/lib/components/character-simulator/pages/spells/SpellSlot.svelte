<script lang="ts">
    let {
        level,
        value,
        max,
    }: {
        level: number;
        value: number;
        max: number;
    } = $props();

    let disabled = $derived(value === 0);
</script>

<div class="spell-slot column" class:disabled>
    <span class="value">{value}</span>
    <span class="max">{max}</span>
    <span class="level tag">{level === 0 ? "c" : level}</span>
</div>

<style>
    .spell-slot {
        background-color: var(--dark-3);
        width: 2rem;
        align-items: center;
        border-radius: 0.5rem 0.5rem 1rem 1rem;
        gap: 0.125rem;
        border: 0.25rem solid var(--dark-3);

        .value {
            font-weight: bold;
            color: var(--light-1);
        }

        .max {
            color: var(--light-3);
        }

        .level {
            background-color: var(--light-1);
            color: var(--dark-3);
            width: 1.5rem;
            height: 1.5rem;
            border-radius: 1rem;
            display: grid;
            place-items: center;
        }

        &.disabled {
            background-color: unset;
            padding: 0.125rem;
            border: 0.125rem solid var(--dark-3);
            .value {
                color: var(--light-3);
            }

            .level {
                background-color: unset;
                color: var(--light-3);
            }
        }
    }
</style>
