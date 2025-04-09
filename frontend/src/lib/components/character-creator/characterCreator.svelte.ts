import type { Ancestry, Attribute, Background, Feat, Heritage, Proficiency, Skill } from "$lib/bindings"
import { parseChoiceSet } from "./ruleParser"

export class CharacterState {
    name: string = $state("")
    level: number = $state(0);
    attributeScores: Record<Attribute, number> = $state({
        Strength: 0,
        Dexterity: 0,
        Constitution: 0,
        Intelligence: 0,
        Wisdom: 0,
        Charisma: 0,
    });

    ancestry: string = $state("");
    ancestryDecisions: Record<string, Choice[]> = $state({});
    heritageDecisions: Choice[] = $state([]);
    ancestryBoosts: Attribute[] = $state([])

    background: string = $state("");
    backgroundDecisions: Record<string, Choice[]> = $state({});
    backgroundBoosts: Attribute[] = $state([])

    class: string = $state("");
    classDecisions: Record<string, Record<string, Choice[]>> = $state({});

    skills: Record<Skill, Proficiency> = $state({
        Acrobatics: 'Untrained',
        Arcana: 'Untrained',
        Athletics: 'Untrained',
        Crafting: 'Untrained',
        Deception: 'Untrained',
        Diplomacy: 'Untrained',
        Intimidation: 'Untrained',
        Medicine: 'Untrained',
        Nature: 'Untrained',
        Occultism: 'Untrained',
        Performance: 'Untrained',
        Religion: 'Untrained',
        Society: 'Untrained',
        Stealth: 'Untrained',
        Survival: 'Untrained',
        Thievery: 'Untrained',
    })
    additionalSkills: Record<string, [Attribute, Proficiency]> = $state({})

    toJSON() {
        return {
            name: this.name,
            level: this.level,
            attributeScores: this.attributeScores,
            ancestry: this.ancestry,
            ancestryDecisions: this.ancestryDecisions,
            heritageDecisions: this.heritageDecisions,
            ancestryBoosts: this.ancestryBoosts,
            background: this.background,
            backgroundDecisions: this.backgroundDecisions,
            backgroundBoosts: this.backgroundBoosts,
            class: this.class,
            classDecisions: this.classDecisions,
            skills: this.skills,
            additionalSkills: this.additionalSkills
        };
    }
}

export const BASIC_SKILL_TO_ATTRIBUTE: Record<Skill, Attribute> = {
    Acrobatics: 'Dexterity',
    Arcana: 'Intelligence',
    Athletics: 'Strength',
    Crafting: 'Intelligence',
    Deception: 'Charisma',
    Diplomacy: 'Charisma',
    Intimidation: 'Charisma',
    Medicine: 'Wisdom',
    Nature: 'Wisdom',
    Occultism: 'Intelligence',
    Performance: 'Charisma',
    Religion: 'Wisdom',
    Society: 'Intelligence',
    Stealth: 'Dexterity',
    Survival: 'Wisdom',
    Thievery: 'Dexterity'
}

export function scoreToModifier(score: number): number {
    return Math.floor((score - 10) / 2)
}

export function proficiencyBonus(proficiency: Proficiency, level: number,) {
    let bonus = 0
    switch (proficiency) {
        case 'Legendary':
            bonus += 2;
        case 'Master':
            bonus += 2;
        case 'Expert':
            bonus += 2;
        case 'Trained':
            bonus += 2
        default: break;
    }
    return bonus + level
}

export enum CharacterCreatorStep {
    Init,
    Ancestry,
    Background,
    Class,
    Finishing,
}

export type DecisionTree = {
    slug: string,
    label: string,
    choices: Choice[]
}

export type Choice = {
    label: string,
    value: string,
    compendiumType: string,
    subDecisions: DecisionTree[]
}

export async function createAncestryDecisionTrees(ancestry: Ancestry): Promise<DecisionTree[]> {
    let trees: DecisionTree[] = []
    for (const rule of ancestry.rules ?? []) {
        if (rule.key === 'ChoiceSet') {
            const decision = await parseChoiceSet(rule, rule.prompt ?? rule.label ?? 'Ancestry Decision', rule.flag ?? '')
            trees.push(decision)
        }
    }
    return trees
}

export async function createAncestryHeritageDecisionTree(ancestry: Ancestry): Promise<DecisionTree> {
    let decisionTree = {
        slug: 'heritage',
        label: 'Heritage',
        choices: []
    } as DecisionTree

    for (const item of ancestry.heritages ?? []) {
        const heritageData: Heritage = await fetch('/api/heritage/' + item.uuid).then(v => v.json())

        let heritageChoice = {
            value: heritageData.slug,
            label: heritageData.name,
            compendiumType: 'heritage',
            subDecisions: []
        } as Choice;

        for (const rule of heritageData.rules ?? []) {
            if (rule.key === 'ChoiceSet') {
                const decision = await parseChoiceSet(rule, heritageData.name, heritageData.slug)
                heritageChoice.subDecisions.push(decision)
            }
        }

        decisionTree.choices.push(heritageChoice)
    }

    return decisionTree
}

export async function createBackgroundDecisionTrees(background: Background): Promise<DecisionTree[]> {
    let trees: DecisionTree[] = []
    for (const rule of background.rules ?? []) {
        if (rule.key === 'ChoiceSet') {
            const decision = await parseChoiceSet(rule, rule.prompt ?? rule.label ?? 'Ancestry Decision', rule.flag ?? '')
            trees.push(decision)
        }
    }
    return trees
}

export async function createClassFeatureDecisionTrees(feat: Feat): Promise<DecisionTree[]> {
    let trees: DecisionTree[] = []
    for (const rule of feat.rules ?? []) {
        if (rule.key === 'ChoiceSet') {
            const decision = await parseChoiceSet(rule, rule.prompt ?? rule.label ?? 'Ancestry Decision', rule.flag ?? '')
            trees.push(decision)
        }
    }
    return trees
}