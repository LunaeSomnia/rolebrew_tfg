<script lang="ts">
    import { Icon } from "$lib/icons/icons";
    import IconSvg from "$lib/icons/IconSVG.svelte";
    import { appState } from "$lib/store.svelte";
    import { onMount } from "svelte";
    import Button from "../Button.svelte";
    import { ALERT_DESTROY_TIMER, type AlertData } from "./alert";
    import { fade, fly, slide } from "svelte/transition";
    import { cubicOut } from "svelte/easing";

    let {
        alert,
        id,
    }: {
        alert: AlertData;
        id: number;
    } = $props();

    const iconFill = {
        normal: "var(--light-3)",
        error: "var(--red-lighter)",
        warning: "var(--yellow-lighter)",
        success: "var(--green-lighter)",
    };
    let fillColor = iconFill[alert.alertType];

    function removeAlert() {
        appState.removeAlert(id);
    }
</script>

<div
    class="alert {alert.alertType} column"
    transition:fly|global={{
        duration: 200,
        y: -8,
        easing: cubicOut,
    }}
>
    <div class="row">
        <IconSvg icon={alert.icon} fill={fillColor} size={"3rem"} />
        <h5>{alert.header}</h5>
        <Button class="ghost" onclick={removeAlert}>
            <IconSvg icon={Icon.Close} fill={fillColor} />
        </Button>
    </div>

    {#if alert.body}
        <p>{alert.body}</p>
    {/if}
</div>

<style lang="scss">
    .alert {
        width: fit-content;
        padding: 0.5rem 1rem;
        border-radius: 0.5rem;
        z-index: 9999;
        pointer-events: all;
        box-shadow: 0rem 0rem 4rem #00000088;
        gap: 0.5rem;

        .row {
            align-items: center;
        }

        &.normal {
            background-color: var(--dark-2);
            * {
                color: var(--dark-0);
            }
        }

        &.error {
            background-color: var(--red-darker);
            * {
                color: var(--red-lighter);
            }
        }

        &.warning {
            background-color: var(--yellow-darker);
            * {
                color: var(--yellow-lighter);
            }
        }

        &.success {
            background-color: var(--green-darker);
            * {
                color: var(--green-lighter);
            }
        }
    }
</style>
