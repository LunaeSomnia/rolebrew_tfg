<script lang="ts">
    let {
        type,
        value,
    }: {
        type: "copper" | "silver" | "gold" | "platinum";
        value: number;
    } = $props();
</script>

<span class="row coin {type}">{value} {type[0]}P</span>

<style lang="scss">
    .coin {
        border-radius: 2rem;
        padding: 0 0.5rem 0 0.5rem;
        align-items: baseline;
        text-transform: uppercase;
        color: var(--dark-1);
        font-weight: 600;

        &.copper {
            background-color: #e05f19;
        }

        &.silver {
            background-color: #9d9d9d;
        }

        &.gold {
            background-color: #eba729;
        }

        &.platinum {
            background-color: var(--light-1);
        }
    }
</style>
