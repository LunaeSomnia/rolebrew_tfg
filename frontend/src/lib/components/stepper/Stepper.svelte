<script lang="ts">
    import type { Step } from "./stepper";
    let {
        steps = $bindable(),
        currentStep,
        onclickstep,
    }: {
        steps: Step[];
        currentStep: number;
        onclickstep?: (idx: number) => void;
    } = $props();
</script>

<div class="steps row">
    {#each steps as step, i}
        <button
            class="step column"
            class:active={i === currentStep}
            class:done={i < currentStep}
            onclick={() => {
                if (onclickstep) onclickstep(i);
            }}
        >
            <div class="row">
                <span class="step-indicator">{i + 1}</span>
                <span>{step.label}</span>
            </div>
            <span class="meta">
                {step.meta ?? ""}
            </span>
        </button>
    {/each}
</div>

<style lang="scss">
    .steps {
        width: 100%;
        gap: 0;
        font-weight: 500;

        .step {
            background-color: unset;
            font-size: inherit;
            font-weight: inherit;
            font-family: inherit;
            width: 100%;
            border-bottom: 0.125rem solid var(--dark-2);
            gap: 0.5rem;
            padding-bottom: 1rem;
            cursor: pointer;
            height: 4.5rem;

            .meta {
                font-weight: normal;
                opacity: 0;
            }

            & > .row {
                align-items: center;
                color: var(--light-3);
            }

            &.active {
                border-color: var(--light-1);
                color: var(--light-1);
                & > .row {
                    color: var(--light-1);
                }

                .step-indicator {
                    background-color: var(--light-1);
                    color: var(--dark-1);
                }
            }

            &.done {
                border-color: var(--orange);
                color: var(--orange);
                & > .row {
                    color: var(--orange);
                }

                .step-indicator {
                    background-color: var(--orange);
                    color: var(--dark-1);
                }

                .meta {
                    opacity: 1;
                }
            }
        }
        .step-indicator {
            width: 2rem;
            height: 2rem;
            background-color: var(--dark-2);
            border-radius: 1rem;
            text-align: center;
            align-content: center;
            font-weight: 600;
        }
    }
</style>
