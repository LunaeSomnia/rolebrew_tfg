<script>
    import { goto } from "$app/navigation";
    import HeroTitle from "$lib/icons/HeroTitle.svelte";

    function onSignup() {
        goto("/signup");
    }
</script>

<section class="hero max-width-wrapper">
    <div class="max-width">
        <div class="hero-img" />
        <div class="hero-title">
            <HeroTitle />
        </div>
        <div class="hero-cta">
            <p>
                Compendium, character sheet creator & simulator. All in one
                place.
            </p>
            <button class="secondary" on:click={onSignup}>Start now</button>
        </div>
    </div>
</section>

<style lang="scss">
    .hero {
        background-color: var(--orange);
        height: 100%;

        .max-width {
            display: flex;
            flex-direction: column;
            gap: 2rem;
        }

        .hero-img {
            height: 30rem;
            width: 100%;
            border-radius: 0.5rem;
            background-color: var(--dark-1);
        }
        .hero-cta {
            display: flex;
            flex-direction: row;
            justify-content: space-between;
            color: var(--dark-1);
        }
    }
</style>
