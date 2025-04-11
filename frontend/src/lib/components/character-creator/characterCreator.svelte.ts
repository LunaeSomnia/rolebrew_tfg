import type { Ancestry, Attribute, Background, Class, Feat, Heritage, Proficiency, SavingThrow, Skill } from "$lib/bindings"
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
    attributeBoosts: Record<Attribute, number> = $derived.by(() => {
        const baseBoosts = {
            Strength: 0,
            Dexterity: 0,
            Constitution: 0,
            Intelligence: 0,
            Wisdom: 0,
            Charisma: 0,
        };

        const boostAttribute = (attribute: Attribute) => {
            if (this.attributeScores[attribute] + baseBoosts[attribute] >= 18) {
                baseBoosts[attribute] += 0.5;
            } else {
                baseBoosts[attribute] += 1;
            }
        }

        for (const boost of this.ancestryBoosts) {
            if (boost)
                boostAttribute(boost)
        }

        for (const boost of this.backgroundBoosts) {
            if (boost)
                boostAttribute(boost)
        }

        return Object.fromEntries(Object.entries(baseBoosts).map(v => {
            const [attribute, score] = v;
            return [attribute as Attribute, Math.floor(score)]
        })) as Record<Attribute, number>
    })
    attributeModifiers: Record<Attribute, number> = $derived(Object.fromEntries(Object.entries(this.attributeScores).map(v => {
        const [attribute, score] = v;
        return [attribute as Attribute, scoreToModifier(score) + this.attributeBoosts[attribute as Attribute]]
    })) as Record<Attribute, number>)

    ancestry: string = $state("");
    ancestryData: Ancestry | undefined = $state();
    ancestryDecisions: Record<string, Choice[]> = $state({});
    heritageDecisions: Choice[] = $state([]);
    ancestryBoosts: (Attribute | undefined)[] = $state([])

    background: string = $state("");
    backgroundData: Background | undefined = $state();
    backgroundDecisions: Record<string, Choice[]> = $state({});
    backgroundBoosts: (Attribute | undefined)[] = $state([])
    backgroundAdditionalSkills: Record<string, [Attribute, Proficiency]> = $state({})

    class: string = $state("");
    classData: Class | undefined = $state();
    classDecisions: Record<string, Record<string, Choice[]>> = $state({});
    keyAbility: Attribute | undefined = $state()

    skillsChosen: (Skill | undefined)[] = $state([])
    skills: Record<Skill, Proficiency> = $derived.by(() => {
        const base: Record<Skill, Proficiency> = {
            acrobatics: 'Untrained',
            arcana: 'Untrained',
            athletics: 'Untrained',
            crafting: 'Untrained',
            deception: 'Untrained',
            diplomacy: 'Untrained',
            intimidation: 'Untrained',
            medicine: 'Untrained',
            nature: 'Untrained',
            occultism: 'Untrained',
            performance: 'Untrained',
            religion: 'Untrained',
            society: 'Untrained',
            stealth: 'Untrained',
            survival: 'Untrained',
            thievery: 'Untrained',
        }

        for (const boost of this.backgroundData?.trainedSkills.value ?? []) {
            base[boost] = 'Trained'
        }

        for (const boost of this.classData?.trainedSkills.value ?? []) {
            base[boost] = 'Trained'
        }

        for (const boost of this.skillsChosen ?? []) {
            if (boost)
                base[boost] = 'Trained'
        }

        return base
    })
    trainableSkillsNumber: number = $derived.by(() => {
        let number = 0;

        const additional = this.classData?.trainedSkills.additional;
        if (additional) {
            console.log('additional', additional)
            number += additional
        }

        if (this.keyAbility) {
            console.log('this.keyAbility', this.keyAbility)
            number += this.attributeModifiers[this.keyAbility]
        }

        return number
    })
    trainableSkills: Skill[] = $derived.by(() => {
        return Object.entries(this.skills).filter(v => v[1] === 'Untrained').map(v => v[0] as Skill)
    })
    additionalSkills: Record<string, [Attribute, Proficiency]> = $derived.by(() => {
        const base: Record<string, [Attribute, Proficiency]> = {}

        const bAS = this.backgroundAdditionalSkills;
        for (const key in bAS) {
            base[key] = bAS[key];
        }

        return base
    })

    toJSON() {
        return {
            name: this.name,
            level: this.level,
            attributeModifiers: this.attributeModifiers,
            keyAbility: this.keyAbility,

            ancestry: this.ancestry,
            ancestryDecisions: this.ancestryDecisions,
            heritageDecisions: this.heritageDecisions,
            background: this.background,
            backgroundDecisions: this.backgroundDecisions,
            class: this.class,
            classDecisions: this.classDecisions,

            skills: this.skills,
            additionalSkills: this.additionalSkills
        };
    }
}

export const SKILLS: Skill[] = [
    "acrobatics",
    "arcana",
    "athletics",
    "crafting",
    "deception",
    "diplomacy",
    "intimidation",
    "medicine",
    "nature",
    "occultism",
    "performance",
    "religion",
    "society",
    "stealth",
    "survival",
    "thievery",
]

export const BASIC_SKILL_TO_ATTRIBUTE: Record<Skill, Attribute> = {
    acrobatics: 'Dexterity',
    arcana: 'Intelligence',
    athletics: 'Strength',
    crafting: 'Intelligence',
    deception: 'Charisma',
    diplomacy: 'Charisma',
    intimidation: 'Charisma',
    medicine: 'Wisdom',
    nature: 'Wisdom',
    occultism: 'Intelligence',
    performance: 'Charisma',
    religion: 'Wisdom',
    society: 'Intelligence',
    stealth: 'Dexterity',
    survival: 'Wisdom',
    thievery: 'Dexterity'
}

export const SAVING_THROW_TO_ATTRIBUTE: Record<SavingThrow | 'perception', Attribute> = {
    fortitude: 'Constitution',
    reflex: 'Dexterity',
    will: 'Wisdom',
    perception: 'Wisdom'
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
    compendiumType?: string,
    subDecisions: DecisionTree[]
}

export async function createAncestryDecisionTrees(ancestry: Ancestry): Promise<DecisionTree[]> {
    let trees: DecisionTree[] = []
    for (const rule of ancestry.rules ?? []) {
        if (rule.key === 'ChoiceSet') {
            const decision = await parseChoiceSet(rule)
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
            const decision = await parseChoiceSet(rule)
            trees.push(decision)
        }
    }
    return trees
}

export async function createFeatureDecisionTrees(feat: Feat): Promise<DecisionTree[]> {
    let trees: DecisionTree[] = []
    for (const rule of feat.rules ?? []) {
        if (rule.key === 'ChoiceSet') {
            const decision = await parseChoiceSet(rule)
            trees.push(decision)
        }
    }
    return trees
}

export function createKeyAbilityDecisionTree(keyAbilities: Attribute[]): DecisionTree {
    return {
        label: "Key Ability",
        slug: 'key-ability',
        choices: keyAbilities.map(v => {
            return {
                label: v,
                value: v,
                subDecisions: []
            } as Choice
        }),
    } as DecisionTree
}