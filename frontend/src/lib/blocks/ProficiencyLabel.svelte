<script lang="ts">
    import type { Proficiency } from "$lib/bindings";
    import Profifiency from "$lib/components/Profifiency.svelte";

    let {
        label,
        proficiency,
    }: {
        label: string;
        proficiency: Proficiency;
    } = $props();
</script>

<div class="row">
    <Profifiency {proficiency} />
    <span>{label}</span>
</div>

<style lang="scss">
    .row {
        align-items: center;
        gap: 0.5rem;

        span {
            flex: 1;
        }
    }
</style>
