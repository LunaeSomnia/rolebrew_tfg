<script lang="ts">
    import type { CharacterSimulationState } from "$lib/characterSimulator.svelte";
    import StringChatMessage from "./StringChatMessage.svelte";
    import SimpleRollChatMessage from "./SimpleRollChatMessage.svelte";
    import {
        type SimpleRollChatMessage as SimpleRollChatMessageType,
        type StringChatMessage as StringChatMessageType,
        type DamageRollChatMessage as DamageRollChatMessageType,
        type ModifierRollChatMessage as ModifierRollChatMessageType,
        type SpellCastChatMessage as SpellCastChatMessageType,
        ChatMessageType,
    } from "$lib/chat";
    import { Icon } from "$lib/icons/icons";
    import { roll } from "$lib/roll";
    import Button from "../../Button.svelte";
    import Dice from "../../Dice.svelte";
    import Input from "../../Input.svelte";
    import ModifierRollChatMessage from "./ModifierRollChatMessage.svelte";
    import DamageRollChatMessage from "./DamageRollChatMessage.svelte";
    import SpellCastChatMessage from "./SpellCastChatMessage.svelte";

    let { simulationState }: { simulationState: CharacterSimulationState } =
        $props();

    let chatInput = $state("");

    function onClickDiceRoll(dice: number) {
        simulationState.pushChatMessage(ChatMessageType.SimpleRoll, {
            dice: `D${dice}`,
            roll: roll(dice),
        } as SimpleRollChatMessageType);
    }

    function onKeyDownChatInput(e: KeyboardEvent) {
        if (e.key === "Enter") {
            simulationState.pushChatMessage(ChatMessageType.StringChat, {
                value: chatInput,
            } as StringChatMessageType);
            chatInput = "";
        }
    }

    function clearMessages() {
        simulationState.chat = [];
    }
</script>

<div class="column chat">
    <div class="column messages">
        {#each simulationState.chat.toReversed() as [type, message]}
            {#if type === ChatMessageType.SimpleRoll}
                {@const msg = message as SimpleRollChatMessageType}
                <SimpleRollChatMessage {msg} />
            {:else if type === ChatMessageType.StringChat}
                {@const msg = message as StringChatMessageType}
                <StringChatMessage {msg} />
            {:else if type === ChatMessageType.ModifierRoll}
                {@const msg = message as ModifierRollChatMessageType}
                <ModifierRollChatMessage {msg} />
            {:else if type === ChatMessageType.DamageRoll}
                {@const msg = message as DamageRollChatMessageType}
                <DamageRollChatMessage {msg} />
            {:else if type === ChatMessageType.SpellCast}
                {@const msg = message as SpellCastChatMessageType}
                <SpellCastChatMessage {msg} />
            {/if}
        {/each}
    </div>

    <Button
        class="trash-button"
        cta="ghost"
        color="red"
        onclick={clearMessages}
        iconLeft={Icon.Trash}
    />

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

    :global(.chat .trash-button) {
        position: absolute;
        top: 0.5rem;
        left: calc(100% - 0.5rem);
        transform: translateX(-100%);
    }

    :global(.dice-button) {
        padding: 0.5rem !important;
    }

    :global(.dice-button svg) {
        width: 1.5rem !important;
        height: 1.5rem !important;
    }
</style>
