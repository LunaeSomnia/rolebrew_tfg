import type { Rule as BaseRule } from "$lib/bindings";
import type { CharacterSimulationState } from "$lib/characterSimulator.svelte";

export abstract class Rule {
    rule: BaseRule;

    constructor(rule: BaseRule) {
        this.rule = rule;
    }

    execute(selector: string, state: CharacterSimulationState, item: any): number {
        if (this.isSelected(selector)) {
            return this.getModifier(state, item);
        }
        return 0;
    }

    abstract ruleKey(): string;

    abstract getModifier(state: CharacterSimulationState, item: any): number;

    abstract isSelected(selector: string): boolean;
}
