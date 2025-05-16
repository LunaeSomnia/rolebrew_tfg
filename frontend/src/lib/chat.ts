import type { DamageRoll, Die, Spell } from "./bindings";

export type ChatMessage = StringChatMessage | SimpleRollChatMessage | DamageRollChatMessage | AttackRollChatMessage | SpellCastChatMessage

export type StringChatMessage = {
    value: string,
}

export type SimpleRollChatMessage = {
    dice: Die,
    roll: number,
}

export type AttackRollChatMessage = {
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

export function isAttackRollChatMessage(msg: ChatMessage): msg is AttackRollChatMessage {
    return (
        (msg as AttackRollChatMessage).modifiers !== undefined &&
        (msg as AttackRollChatMessage).roll !== undefined
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