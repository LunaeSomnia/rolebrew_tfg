import type { DamageRoll, Die, Spell } from "./bindings";

export type ChatMessage = StringChatMessage | SimpleRollChatMessage | DamageRollChatMessage | ModifierRollChatMessage | SpellCastChatMessage

export type StringChatMessage = {
    value: string,
}

export type SimpleRollChatMessage = {
    name?: string,
    dice: Die,
    roll: number,
}

export type ModifierRollChatMessage = {
    name: string,
    modifiers: ModAttribute[],
    roll: number,
}

export type DamageRollChatMessage = {
    name: string,
    damages: DamageRoll[],
    rolls: number[][],
    times2: boolean,
}

export type SpellCastChatMessage = {
    spell: Spell
}

export function isStringChatMessage(msg: ChatMessage): msg is StringChatMessage {
    return (msg as StringChatMessage).value !== undefined;
}

export function isSimpleRollChatMessage(msg: ChatMessage): msg is SimpleRollChatMessage {
    return (
        (msg as SimpleRollChatMessage).dice !== undefined &&
        (msg as SimpleRollChatMessage).roll !== undefined
    );
}

export function isModifierRollChatMessage(msg: ChatMessage): msg is ModifierRollChatMessage {
    return (
        (msg as ModifierRollChatMessage).modifiers !== undefined &&
        (msg as ModifierRollChatMessage).roll !== undefined
    );
}

export function isDamageRollChatMessage(msg: ChatMessage): msg is DamageRollChatMessage {
    return (
        (msg as DamageRollChatMessage).damages !== undefined &&
        (msg as DamageRollChatMessage).rolls !== undefined
    );
}

export function isSpellCastChatMessage(msg: ChatMessage): msg is SpellCastChatMessage {
    return (
        (msg as SpellCastChatMessage).spell !== undefined
    );
}

export type ModAttribute = {
    value: number;
    isProficiency?: boolean;
    type: string;
    modifier: "+" | "-" | "*" | "/";
};