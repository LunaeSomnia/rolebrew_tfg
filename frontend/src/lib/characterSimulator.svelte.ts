import type {
    Attribute,
    Character,
    Condition,
    Equipment,
    Proficiency,
    Skill,
    Spell,
} from "./bindings";
import {
    proficiencyBonus,
} from "./components/character-creator/characterCreator.svelte";
import SpellsPage from "./components/character-simulator/pages/spells/SpellsPage.svelte";
import { roll } from "./roll";
import { createRule } from "./rules/factory";
import { Rule } from "./rules/rule";
import type { RuleAttributeSelectors, RuleSkillCheckSelectors, RuleSkillSelectors } from "./rules/selectors";
import { ConditionItem, GeneralItem, HPItem, SimulationItem, SkillItem } from "./simulationItem.svelte";
import { skillToAttribute } from "./skills";
import { getSpellSlotTableByClassName, type LevelSpellSlotRow } from "./spells";

type Items = {
    hp: HPItem,
    tempHp: HPItem,
    heroPoints: GeneralItem,
    skills: Record<Skill, SkillItem>,
    conditions: ConditionItem[],
}

type ActiveRule = {
    from: SimulationItem | undefined,
    rule: Rule,
}

export class CharacterSimulationState {
    character: Character;

    items: Items = $state({
        hp: new HPItem(["hp"], 0),
        tempHp: new HPItem(["temp-hp"], 0),
        heroPoints: new GeneralItem(["hero-points"], 0),
        skills: createSkillState({
            acrobatics: "Untrained",
            arcana: "Untrained",
            athletics: "Untrained",
            crafting: "Untrained",
            deception: "Untrained",
            diplomacy: "Untrained",
            intimidation: "Untrained",
            medicine: "Untrained",
            nature: "Untrained",
            occultism: "Untrained",
            performance: "Untrained",
            religion: "Untrained",
            society: "Untrained",
            stealth: "Untrained",
            survival: "Untrained",
            thievery: "Untrained"
        }, {
            Strength: 0,
            Dexterity: 0,
            Constitution: 0,
            Intelligence: 0,
            Wisdom: 0,
            Charisma: 0
        }, 0),
        conditions: []
    });

    spellSlots: LevelSpellSlotRow = $state({
        0: 0,
        1: 0,
        2: 0,
        3: 0,
        4: 0,
        5: 0,
        6: 0,
        7: 0,
        8: 0,
        9: 0,
        10: 0,
    })
    spells: Record<number, Spell[]> = $state({})
    focused = $state(false)

    armorClass: [number, Proficiency] = $derived.by(() => {
        let base = 10;
        let proficiency: Proficiency = "Untrained";

        if (this.currentArmor === "unarmored") {
            base += proficiencyBonus(
                this.character.armorProficiencies.unarmored,
                this.character.level,
            );
            proficiency = this.character.armorProficiencies.unarmored;
        } else if (this.currentArmor !== "") {
            const equipmentItem = this.equipment.equipment.find(
                (v) => v.definition.slug === this.currentArmor,
            );
            if (equipmentItem) {
                type ProficiencyKey = keyof typeof this.character.armorProficiencies
                if (equipmentItem.definition.category) {
                    let key = equipmentItem.definition.category as ProficiencyKey
                    proficiency = this.character.armorProficiencies[key]
                }
                base += equipmentItem.definition.acBonus ?? 0;
            }
        }

        return [base, proficiency];
    });
    currentArmor: string = $state("Unarmored");
    hasShieldUp: boolean = $state(false);
    currentShield: string | undefined = $state(undefined);

    initiative: number | undefined = $state(undefined);

    chat: string[] = $state([]);

    money: {
        copper: number;
        silver: number;
        gold: number;
        platinum: number;
    } = $state({
        copper: 0,
        silver: 0,
        gold: 0,
        platinum: 0,
    });

    equipment: EquipmentState = $state(new EquipmentState());

    activeConditions = $derived.by(() => {
        return this.items.conditions.filter((v) => v.active)
    });

    activeRules: ActiveRule[] = $derived.by(() => {
        let rules: ActiveRule[] = this.character.rules.map(v => {
            return {
                from: undefined,
                rule: createRule(v)
            } as ActiveRule
        }).filter(v => v.rule !== null);
        rules = rules.concat(
            this.activeConditions.map((v) => v.definition.rules.map(v2 => {
                return {
                    from: v,
                    rule: createRule(v2)
                } as ActiveRule
            })).flat().filter(v => v.rule !== null),
        );
        // let rules2: ActiveRule[] = rules
        //     // .filter((v) => v.key !== "ChoiceSet" && v.key !== "GrantItem")
        //     .filter((v) => v !== null);
        return rules
    });

    info = $state({
        // origin and appareance
        ethnicity: "",
        nationality: "",
        birthplace: "",
        age: "",
        genderAndPronouns: "",
        height: "",
        weight: "",
        appareance: "",

        // personality
        attitude: "",
        deityOrPhilosophy: "",
        edicts: "",
        anathema: "",
        likes: "",
        dislikes: "",
        catchphrases: "",

        // campaign notes
        allies: "",
        enemies: "",
        organizations: "",
        notes: "",
    });

    constructor(character: Character, conditions: Condition[]) {
        this.character = character;

        this.items = {
            hp: new HPItem(["hp"], this.character.hp),
            tempHp: new HPItem(["temp-hp"], 0),
            heroPoints: new GeneralItem(["hero-points"], 0),
            skills: createSkillState(character.skills, character.attributeModifiers, character.level),
            conditions: conditions.map((v) => {
                return new ConditionItem(v);
            })
        }

        this.spellSlots = getSpellSlotTableByClassName(this.character.class)[character.level]
    }

    static fromPreviousState(character: Character, foundState: any) {
        let state = new this(character, []);


        console.log("foundState", foundState)

        state.items = {

            hp: new HPItem(["hp"], foundState.hp as number),
            tempHp: new HPItem(["temp-hp"], foundState.tempHp as number),
            heroPoints: new GeneralItem(["hero-points"], foundState.heroPoints as number),
            conditions: foundState.conditions.map((v: any) =>
                ConditionItem.fromState(v),
            ),
            skills: createSkillState(character.skills, character.attributeModifiers, character.level)
        }

        state.currentArmor = foundState.currentArmor;
        state.currentShield = foundState.currentShield;
        state.initiative = foundState.initiative;
        state.chat = foundState.chat;
        state.money = foundState.money;
        state.equipment = EquipmentState.fromState(foundState.equipment as any);
        state.info = foundState.info;
        state.spellSlots = foundState.spellSlots;
        state.focused = foundState.focused;
        state.spells = foundState.spells;

        return state;
    }

    ableToSelectors = $derived.by(() => {
        let items: SimulationItem[] = []

        if (this.items) {
            items = items.concat([this.items.hp, this.items.tempHp, this.items.heroPoints])
            items = items.concat(Object.entries(this.items.skills).map(([_key, value]) => value))
        }


        return items
    })

    rulesAppliedToSelectors(selectors: string[]): ActiveRule[] {
        return this.activeRules.filter(v => {
            for (const selector of selectors) {
                if (v.rule.isSelected(selector))
                    return true
            }
            return false
        })
    }

    rulesAppliedToSelector(selector: string): ActiveRule[] {
        return this.activeRules.filter(v => v.rule.isSelected(selector))
    }

    getFromSelector(selector: string): SimulationItem[] {
        return this.ableToSelectors.filter(v => v.selectors.includes(selector))
    }



    rollInitiative(skill: Skill) {
        this.initiative =
            roll(20) +
            proficiencyBonus(
                this.character.skills[skill],
                this.character.level,
            );
        this.pushChatMessage("rolled iniciative: " + this.initiative);
    }

    pushChatMessage(msg: string) {
        this.chat.push(msg);
    }

    //

    toJSON() {
        if (!this.items) {
            throw new Error("Can't save uninitialized character")
        }

        return {
            hp: this.items.hp,
            tempHp: this.items.tempHp,
            heroPoints: this.items.heroPoints,
            currentArmor: this.currentArmor,
            currentShield: this.currentShield,
            initiative: this.initiative,
            spellSlots: this.spellSlots,
            focused: this.focused,
            chat: this.chat,
            money: this.money,
            equipment: this.equipment.toJSON(),
            conditions: this.items.conditions.map((v) => v.toJSON()),
            info: this.info,
            spells: this.spells
        };
    }
}



export class EquipmentState {
    equipment: EquipmentItemState[] = $state([]);

    static fromState(foundState: any) {
        let newState = new this();

        let equipment: EquipmentItemState[] = [];

        for (const foundStateEquipment of foundState.equipment) {
            equipment.push(EquipmentItemState.fromState(foundStateEquipment));
        }

        newState.equipment = equipment;

        return newState;
    }

    toJSON() {
        return {
            equipment: this.equipment.map((v) => v.toJSON()),
        };
    }
}

export class EquipmentItemState {
    definition: Equipment;
    worn = $state(false);

    static fromState(foundState: any) {
        let state = new this(foundState.definition as Equipment);

        state.worn = foundState.worn;

        return state;
    }

    constructor(definition: Equipment) {
        this.definition = definition;
    }

    toJSON() {
        return {
            definition: this.definition,
            worn: this.worn,
        };
    }
}

function createSkillState(skills: Record<Skill, Proficiency>, attributeModifiers: Record<Attribute, number>, level: number): Record<Skill, SkillItem> {
    let entries = Object.entries(skills);
    let newRecord: any = {}
    for (const [skill, proficiency] of entries) {
        let attribute = skillToAttribute(skill as Skill);
        let attributeSkillBased = attribute.substring(0, 3).toLowerCase() + '-skill-based'
        let attributeBased = attribute.substring(0, 3).toLowerCase() + '-based'
        newRecord[skill] = new SkillItem(
            [skill as RuleSkillSelectors,
            attributeSkillBased as RuleAttributeSelectors,
            attributeBased as RuleSkillCheckSelectors],
            attributeModifiers[attribute],
            level,
            proficiency)
    }
    return newRecord as Record<Skill, SkillItem>
}