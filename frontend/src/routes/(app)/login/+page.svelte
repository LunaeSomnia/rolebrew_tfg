<script>
    import { goto } from "$app/navigation";
    import { PUBLIC_BACKEND_URL } from "$env/static/public";
    import { AlertType } from "$lib/components/alert/alert.js";
    import Button from "$lib/components/Button.svelte";
    import InputField from "$lib/components/InputField.svelte";
    import { Icon } from "$lib/icons/icons.js";
    import { appState } from "$lib/store.svelte";

    let { data } = $props();

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
            appState.addAlert(AlertType.Success, Icon.Logo, "Welcome", null);
            goto("/", {
                invalidateAll: true,
            });
        } else {
            let errorBody =
                "There was an error during login. Please try again later or contact an administrator";
            if (!response.bodyUsed) {
                errorBody = await response.text();
            }
            appState.addAlert(AlertType.Error, Icon.Logo, "Error", errorBody);
        }
    }
</script>

<div class="login column">
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

<style lang="scss">
    .column {
        width: 100%;
    }

    .login {
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
