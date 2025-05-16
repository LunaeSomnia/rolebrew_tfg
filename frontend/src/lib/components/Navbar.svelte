<script lang="ts">
    import { goto } from "$app/navigation";
    import Button from "$lib/components/Button.svelte";
    import { Icon } from "$lib/icons/icons";
    import IconSVG from "$lib/icons/IconSVG.svelte";
    import { appState } from "$lib/store.svelte";
    import Popover from "./Popover.svelte";

    let { basePath, user } = $props();

    function onLogin() {
        goto("/login");
    }

    function onSignup() {
        goto("/signup");
    }

    const navLinks = [
        ["compendium", "Compendium"],
        ["characters", "Characters"],
        // ["sessions", "Sessions"],
        ["about", "About"],
    ];
</script>

<nav>
    <div class="max-width">
        <div class="left">
            <a href="/" data-sveltekit-preload-data={false}>
                <IconSVG icon={Icon.Logo} size="2rem" />
            </a>
            {#each navLinks as [link, header]}
                <a
                    class="no-accent no-decoration"
                    class:active={basePath === link}
                    href="/{link}/"
                    data-sveltekit-preload-data={false}
                >
                    {header}</a
                >
            {/each}
        </div>
        <div class="right">
            {#if user}
                {#snippet userHeader()}
                    <p>{user.username}</p>
                {/snippet}
                <Popover headerSnippet={userHeader}>
                    <div class="column user-popover-content">
                        <a href="/profile">Profile</a>
                        <a href="/logout">Log out</a>
                    </div>
                </Popover>
            {:else}
                <Button cta="secondary" onclick={onLogin}>Log in</Button>
                <Button onclick={onSignup}>Sign up</Button>
            {/if}
        </div>
    </div>
</nav>

<style lang="scss">
    a {
        max-height: 2rem;

        &.active {
            color: var(--orange);
        }
    }
    nav {
        position: sticky;
        top: 0;
        width: 100%;
        display: grid;
        place-items: center;
        height: 4rem;
        background-color: var(--dark-2);
        z-index: 1;
        box-shadow: 0rem 0rem 2rem #00000088;

        .max-width,
        .left,
        .right {
            height: 100%;
            display: flex;
            flex-direction: row;
            align-items: center;
            justify-content: space-between;
        }

        .left {
            gap: 2rem;
        }

        .right {
            gap: 0.5rem;
        }

        .left,
        .right {
            justify-content: flex-start;
            --icon-color: var(--orange);
            --icon-stroke-width: 0.09375rem; // 1.5px
        }
    }

    .user-popover-content {
        padding: 1rem 2rem;
    }
</style>
