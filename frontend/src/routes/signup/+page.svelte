<script lang="ts">
    import { PUBLIC_BACKEND_URL } from "$env/static/public";
    import type { SignupForm } from "$lib/bindings";
    import Button from "$lib/components/Button.svelte";
    import InputField from "$lib/components/InputField.svelte";

    let email = $state("user@mail.com");
    let username = $state("test_user");
    let password = $state("test_password");

    async function sendSignupRequest() {
        const singupRequest = await fetch(
            PUBLIC_BACKEND_URL + "/api/auth/signup",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    email,
                    username,
                    password,
                } as SignupForm),
                credentials: "include",
            },
        );

        console.log(singupRequest);
    }
</script>

<div class="wrapper">
    <div class="column">
        <h1>Sign Up</h1>
        <p>Welcome back! Glad you have you around.</p>
        <div class="column card">
            <div class="column input-group">
                <span class="tag small">Email</span>
                <InputField
                    bind:value={email}
                    placeholder="Email"
                    type="email"
                />
            </div>
            <div class="column input-group">
                <span class="tag small">Username</span>
                <InputField
                    bind:value={username}
                    placeholder="Username"
                    type="text"
                />
            </div>
            <div class="column input-group">
                <span class="tag small">Password</span>
                <InputField
                    bind:value={password}
                    placeholder="Password"
                    type="password"
                />
            </div>
            <a href="/forgot-password">I forgot my password</a>
            <Button onclick={sendSignupRequest}>Sign up</Button>
            <p>Already have an account? Log in <a href="/login">Here</a></p>
        </div>
    </div>
</div>

<style lang="scss">
    .wrapper {
        display: grid;
        place-items: center;
    }

    .column {
        width: 100%;
    }

    .wrapper > .column {
        max-width: var(--max-width);
        padding: 8rem 0;
        gap: 2rem;
        align-items: center;
    }

    h1 {
        width: auto;
    }

    .card {
        width: calc(var(--col-width) * 4 + var(--col-spacing) * 3);
        gap: 2rem;
        align-items: center;
    }
</style>
