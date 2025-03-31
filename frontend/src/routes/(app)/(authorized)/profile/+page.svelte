<script lang="ts">
    import type { UserState } from "$lib/store.svelte.js";

    let { data } = $props();

    // @ts-ignore
    const user: UserState | null = $derived(data.user);
</script>

{#if user}
    <p>{user.username}</p>
{/if}
