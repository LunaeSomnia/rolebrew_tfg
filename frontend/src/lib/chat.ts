import type { DamageRoll } from "./bindings";

export type ChatMessage = StringChatMessage | DamageRollChatMessage | AttackRollChatMessage

export type StringChatMessage = {
    value: string,
}

export type AttackRollChatMessage = {
    name: string,
    modifiers: ModAttribute[],
    roll: number,
}

export type DamageRollChatMessage = {
    name: string,
    damages: DamageRoll[],
    rolls: number[],
}

export type ModAttribute = {
    value: number;
    isProficiency?: boolean;
    type: string;
    modifier: "+" | "-" | "*" | "/";
};