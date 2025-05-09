import type { Rule as BaseRule } from "$lib/bindings";
import { FlatModifierRule } from "./flatModifier";
import type { Rule } from "./rule";

export function createRule(rule: BaseRule): Rule | null {
    const keyType = rule.key;
    switch (keyType) {
        case "FlatModifier":
            return new FlatModifierRule(rule);
        default:
            return null;
    }
}
