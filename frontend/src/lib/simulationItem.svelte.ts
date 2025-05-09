import type { Condition, Proficiency } from "./bindings";
import { proficiencyBonus } from "./components/character-creator/characterCreator.svelte";
import { createRule } from "./rules/factory";
import type { Rule } from "./rules/rule";
import type { RuleAttributeSelectors, RuleGeneralSelectors, RuleHpSelectors, RuleSkillCheckSelectors, RuleSkillSelectors } from "./rules/selectors";

/// Simulates a Check
export abstract class SimulationItem {
    selectors: string[];
    rules: Rule[];
    definition?: any;

    constructor(selectors: string[], rules: Rule[] = [], definition: any = undefined) {
        this.selectors = selectors
        this.rules = rules
        this.definition = definition
    }

    abstract toJSON(): any;
}

export class SkillItem extends SimulationItem {
    proficiency: Proficiency = 'Untrained';
    attributeModifier: number = 0;
    level: number = 0;

    value: number = $derived(this.attributeModifier +
        proficiencyBonus(this.proficiency, this.level));

    constructor(selectors: (RuleSkillCheckSelectors | RuleAttributeSelectors | RuleSkillSelectors)[], modifier: number, level: number, proficiency: Proficiency) {
        super(selectors)
        this.proficiency = proficiency;
        this.attributeModifier = modifier;
        this.level = level;
    }

    toJSON() {
        return this.value;
    }
}

export class GeneralItem extends SimulationItem {
    value: number = $state(0);

    constructor(selectors: RuleGeneralSelectors[], value: number) {
        super(selectors)
        this.value = value
    }

    toJSON() {
        return this.value;
    }
}

export class HPItem extends SimulationItem {
    value: number = $state(0);

    constructor(selectors: RuleHpSelectors[], value: number) {
        super(selectors)
        this.value = value
    }

    toJSON() {
        return this.value;
    }
}

export class ConditionItem extends SimulationItem {
    definition: Condition;
    active: boolean = $state(false);
    value: number = $state(0);

    isActive: boolean = $derived(this.active || this.value > 0);

    static fromState(foundState: any) {
        let state = new ConditionItem(foundState.definition as Condition);

        state.active = foundState.active;
        state.value = foundState.value;

        return state;
    }

    constructor(definition: Condition) {
        super([definition.slug], definition.rules.map(v => createRule(v)).filter(v => v !== null), definition)
        this.definition = definition
    }

    toJSON() {
        return {
            definition: this.definition,
            active: this.active,
            value: this.value,
        };
    }
}   