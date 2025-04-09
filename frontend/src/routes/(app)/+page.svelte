<script lang="ts">
    import { goto } from "$app/navigation";
    import Button from "$lib/components/Button.svelte";
    import HeroTitle from "$lib/icons/HeroTitle.svelte";
    import type { LayoutProps } from "./$types";

    let { data }: LayoutProps = $props();

    function onSignup() {
        goto("/signup");
    }
</script>

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
<!-- svelte-ignore element_invalid_self_closing_tag -->
<div class="background" />

<style lang="scss">
    .background {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: var(--orange);
        z-index: -1;
    }
    .hero {
        width: 100%;
        height: 100%;
        padding: 4rem 0;

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
