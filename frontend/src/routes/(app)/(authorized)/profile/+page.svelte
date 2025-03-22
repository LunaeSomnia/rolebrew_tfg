<script lang="ts">
    import { userState } from "$lib/store.svelte.js";

    let { data } = $props();
</script>

{#if userState.username}
    <p>State exists</p>
    <p>{JSON.stringify(userState as object)}</p>
    <p>${userState.username}$</p>
{/if}
