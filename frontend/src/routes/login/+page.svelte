<script>
    import { goto } from "$app/navigation";
    import { PUBLIC_BACKEND_URL } from "$env/static/public";
    import Button from "$lib/components/Button.svelte";
    import InputField from "$lib/components/InputField.svelte";

    let username = $state("test_user");
    let password = $state("test_password");

    async function sendLoginRequest() {
        const response = await fetch(PUBLIC_BACKEND_URL + "/api/auth/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                username,
                password,
            }),
            credentials: "include",
        });

        if (response.ok && response.status === 200) {
            goto("/profile");
        }
    }
</script>

<div class="wrapper">
    <div class="column">
        <h1>Log In</h1>
        <p>Welcome back! Glad you have you around.</p>
        <div class="column card">
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
            <Button onclick={sendLoginRequest}>Log in</Button>
            <p>No account? Sign up <a href="/signup">Here</a></p>
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
