<script lang="ts">
    import { goto } from "$app/navigation";
    import Button from "$lib/components/Button.svelte";
    import HeroTitle from "$lib/icons/HeroTitle.svelte";
    import Navbar from "$lib/Navbar.svelte";
    import type { LayoutProps } from "./$types";

    let { data }: LayoutProps = $props();

    function onSignup() {
        goto("/signup");
    }
</script>

<Navbar basePath={data.basePath ?? ""} />
<section class="hero max-width-wrapper">
    <div class="column max-width">
        <div class="hero-img"></div>
        <div class="hero-title">
            <HeroTitle />
        </div>
        <div class="row hero-cta">
            <p>
                Compendium, character sheet creator & simulator. All in one
                place.
            </p>
            <Button class="secondary" onclick={onSignup}>Start now</Button>
        </div>
    </div>
</section>

<style lang="scss">
    .hero {
        background-color: var(--orange);
        height: 100%;
        padding: 8rem 0;

        .max-width {
            gap: 2rem;
        }

        .hero-img {
            height: 30rem;
            width: 100%;
            border-radius: 0.5rem;
            background-color: var(--dark-1);
        }

        .hero-title {
            width: 100%;
            height: fit-content;
        }

        .hero-cta {
            width: 100%;
            justify-content: space-between;
            color: var(--dark-1);
        }
    }
</style>
