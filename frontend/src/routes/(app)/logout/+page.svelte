<script>
    import { goto } from "$app/navigation";
    import { AlertType } from "$lib/components/alert/alert";
    import { Icon } from "$lib/icons/icons";
    import { appState } from "$lib/store.svelte";
    import { onMount } from "svelte";

    onMount(() => {
        appState.addAlert(AlertType.Success, Icon.Logo, "Logout Successful");
        goto("/", { invalidateAll: true });
    });
</script>
