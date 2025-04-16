<script lang="ts">
    import type { CharacterSimulationState } from "$lib/characterSimulator.svelte";
    import { roll } from "$lib/roll";
    import Button from "../Button.svelte";
    import Dice from "../Dice.svelte";
    import Input from "../Input.svelte";

    let {
        state: characterState,
        show = $bindable(),
    }: { state: CharacterSimulationState; show: boolean } = $props();

    let chatInput = $state("");

    function onClickDiceRoll(dice: number) {
        characterState.pushChatMessage(`Rolled a D${dice}: ${roll(dice)}`);
    }

    function onKeyDownChatInput(e: KeyboardEvent) {
        if (e.key === "Enter") {
            characterState.pushChatMessage(chatInput);
        }
    }
</script>

{#if show}
    <div class="column chat">
        <div class="column messages">
            {#each characterState.chat.toReversed() as message}
                <span>{message}</span>
            {/each}
        </div>
        <div class="column chat-controls">
            <Input
                bind:value={chatInput}
                placeholder="Chat"
                onkeydown={onKeyDownChatInput}
            />
            <div class="row dice">
                <Button
                    class="dice-button"
                    cta="secondary"
                    onclick={() => onClickDiceRoll(4)}
                >
                    <Dice dice={4} />
                </Button>
                <Button
                    class="dice-button"
                    cta="secondary"
                    onclick={() => onClickDiceRoll(6)}
                >
                    <Dice dice={6} />
                </Button>
                <Button
                    class="dice-button"
                    cta="secondary"
                    onclick={() => onClickDiceRoll(8)}
                >
                    <Dice dice={8} />
                </Button>
                <Button
                    class="dice-button"
                    cta="secondary"
                    onclick={() => onClickDiceRoll(12)}
                >
                    <Dice dice={12} />
                </Button>
                <Button
                    class="dice-button"
                    cta="secondary"
                    onclick={() => onClickDiceRoll(20)}
                >
                    <Dice dice={20} />
                </Button>
                <Button
                    class="dice-button"
                    cta="secondary"
                    onclick={() => onClickDiceRoll(100)}
                >
                    <Dice dice={100} />
                </Button>
            </div>
        </div>
    </div>
{/if}

<style>
    .chat {
        position: fixed;
        width: 20rem;
        height: calc(100vh - 8rem);
        align-self: flex-end;
        border-radius: 0.5rem;
        gap: 0;
        overflow: hidden;
    }

    .messages {
        width: 100%;
        height: 100%;
        flex-direction: column-reverse;
        overflow-y: auto;
        padding: 1rem;
        border: solid 0.125rem var(--dark-2);
        border-radius: 0.5rem 0.5rem 0 0;
    }

    .chat-controls {
        width: 100%;
        gap: 1;
        padding: 1rem;
        background-color: var(--dark-2);
        gap: 1rem;

        .dice {
            width: 100%;
            gap: 0;
            justify-content: space-between;
        }
    }

    :global(.dice-button) {
        padding: 0.5rem !important;
    }

    :global(.dice-button svg) {
        width: 1.5rem !important;
        height: 1.5rem !important;
    }
</style>
