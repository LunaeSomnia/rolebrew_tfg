<script lang="ts">
    import { goto } from "$app/navigation";
    import { Icon } from "./icons/icons";
    import IconSVG from "./icons/IconSVG.svelte";

    function onLogin() {
        goto("/login");
    }

    function onSignup() {
        goto("/signup");
    }
</script>

<nav>
    <div class="max-width">
        <div class="left">
            <a href="/">
                <IconSVG icon={Icon.Logo} fill="var(--light-1)" />
            </a>
            <a class="non-accent" href="/compendium">Compendium</a>
            <a class="non-accent" href="/characters">Characters</a>
            <a class="non-accent" href="/sessions">Sessions</a>
            <a class="non-accent" href="/about">About</a>
        </div>
        <div class="right">
            <button class="secondary" on:click={onLogin}>Log in</button>
            <button on:click={onSignup}>Sign up</button>
        </div>
    </div>
</nav>

<style lang="scss">
    a {
        max-height: 2rem;
    }
    nav {
        display: grid;
        place-items: center;
        height: 4rem;
        background-color: var(--dark-2);

        .max-width,
        .left,
        .right {
            height: 100%;
            display: flex;
            flex-direction: row;
            align-items: center;
            justify-content: space-between;
            gap: 1rem;
        }

        .left,
        .right {
            justify-content: flex-start;

            a {
                text-decoration: none;
            }
        }
    }
</style>
