<script lang="ts">
    import { EquipmentItemState } from "$lib/characterSimulator.svelte";
    import Button from "$lib/components/Button.svelte";
    import { Icon } from "$lib/icons/icons";

    let { equipment }: { equipment: EquipmentItemState } = $props();
</script>

<div class="row equipment-item spaced-between">
    <div>
        <span class="tag">{equipment.definition.level ?? 0}</span>
        <span class="name">{equipment.definition.name}</span>
    </div>
    <div>
        <Button
            cta={equipment.worn ? "primary" : "secondary"}
            onclick={() => (equipment.worn = !equipment.worn)}
            iconLeft={Icon.Armor}
        ></Button>
    </div>
</div>

<style lang="scss">
    .equipment-item {
        width: 100%;

        .name {
            color: var(--light-1);
            font-weight: 600;
        }
    }
</style>
