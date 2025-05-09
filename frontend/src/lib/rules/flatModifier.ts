import { Rule } from "./rule";
import type { Rule as BaseRule } from "$lib/bindings";
import type { CharacterSimulationState } from "$lib/characterSimulator.svelte";
import { min } from "./evalfunctions";

const RULEKEY = "FlatModifier";

export class FlatModifierRule extends Rule {
    constructor(rule: BaseRule) {
        super(rule);
        if (rule.key !== RULEKEY) {
            throw new Error(
                `Rule wasn't of correct type: found type ${RULEKEY} but expected ${rule.key}`,
            );
        }

        this.rule = rule;
    }

    ruleKey(): string {
        return RULEKEY;
    }

    settle(item: any) {

    }

    getModifier(state: CharacterSimulationState, item: any): number {
        if (this.rule.key === RULEKEY) {
            let str = this.rule.value?.toString() ?? "0";
            str = str.replaceAll("@item.badge.value", item.value);
            str = str.replaceAll("@actor.level", state.character.level.toString());
            return eval(str);
        }
        return 0;
    }

    isSelected(selector: string): boolean {
        if (this.rule.key === RULEKEY) {
            return this.rule.selector.includes(selector);
        }
        return false;
    }
}
