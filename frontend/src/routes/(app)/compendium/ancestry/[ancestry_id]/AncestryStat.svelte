<script lang="ts">
    type Props = {
        label: string;
        value?: string;
        values?: string[];
    };
    let { label, value, values }: Props = $props();
</script>

<div class="column ancestry-stat">
    <span class="tag">{label}</span>
    {#if value}
        <p>{value}</p>
    {/if}
    {#if values}
        <ul>
            {#each values as value}
                <li>{value}</li>
            {/each}
        </ul>
    {/if}
</div>

<style lang="scss">
    .ancestry-stat {
        width: 100%;
        background-color: var(--dark-2);
        padding: 1rem;
        gap: 0.25rem;
        height: auto;
    }

    span {
        color: var(--light-3);
    }

    ul {
        margin-top: 0.5rem;
    }

    li {
        text-transform: capitalize;
    }

    p {
        margin-top: 0.5rem;
        color: var(--light-2);
    }
</style>
