<script lang="ts">
    import type { SignupForm } from "$lib/bindings";
    import { AlertData, AlertType } from "$lib/components/alert/alert";
    import Button from "$lib/components/Button.svelte";
    import InputField from "$lib/components/InputField.svelte";
    import { Icon } from "$lib/icons/icons";
    import { appState } from "$lib/store.svelte";

    let email = $state("user@mail.com");
    let username = $state("test_user");
    let password = $state("test_password");

    async function sendSignupRequest() {
        const signupRequest = await fetch("/api/auth/signup", {
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
        });

        if (!signupRequest.ok) {
            let errorBody =
                "There was an error during signup. Please try again later or contact an administrator";
            if (!signupRequest.bodyUsed) {
                errorBody = await signupRequest.text();
            }
            appState.addAlert(AlertType.Error, Icon.Logo, "Error", errorBody);
        } else {
            appState.addAlert(AlertType.Success, Icon.Logo, "Success");
        }
    }
</script>

<div class="signup column">
    <h1>Sign Up</h1>
    <p>Welcome back! Glad you have you around.</p>
    <div class="column card">
        <div class="column input-group">
            <span class="tag small">Email</span>
            <InputField bind:value={email} placeholder="Email" type="email" />
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

<style lang="scss">
    .column {
        width: 100%;
    }

    .signup {
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
