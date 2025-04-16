import type {
    Character,
    Condition,
    Equipment,
    Proficiency,
    Skill,
} from "./bindings";
import {
    BASIC_SKILL_TO_ATTRIBUTE,
    proficiencyBonus,
    scoreToModifier,
} from "./components/character-creator/characterCreator.svelte";
import { roll } from "./roll";

export class CharacterSimulationState {
    character: Character;

    hp: number = $state(0);
    tempHp: number = $state(0);

    heroPoints: number = $state(0);

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
                switch (equipmentItem.definition.category) {
                    case "light":
                        proficiency = this.character.armorProficiencies.light;
                        break;
                    case "medium":
                        proficiency = this.character.armorProficiencies.medium;
                        break;
                    case "heavy":
                        proficiency = this.character.armorProficiencies.heavy;
                        break;
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

    conditions: ConditionState[] = $state([]);

    static fromPreviousState(character: Character, foundState: any) {
        let state = new this(character, []);

        state.hp = foundState.hp;
        state.tempHp = foundState.tempHp;
        state.heroPoints = foundState.heroPoints;
        state.currentArmor = foundState.currentArmor;
        state.currentShield = foundState.currentShield;
        state.initiative = foundState.initiative;
        state.chat = foundState.chat;
        state.money = foundState.money;
        state.equipment = EquipmentState.fromState(foundState.equipment as any);
        state.conditions = foundState.conditions.map((v: any) =>
            ConditionState.fromState(v),
        );

        return state;
    }

    constructor(character: Character, conditions: Condition[]) {
        this.character = character;

        this.hp = this.character.hp;
        this.conditions = conditions.map((v) => {
            return new ConditionState(v);
        });
    }

    //

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
        return {
            hp: this.hp,
            tempHp: this.tempHp,
            heroPoints: this.heroPoints,
            currentArmor: this.currentArmor,
            currentShield: this.currentShield,
            initiative: this.initiative,
            chat: this.chat,
            money: this.money,
            equipment: this.equipment.toJSON(),
            conditions: this.conditions.map((v) => v.toJSON()),
        };
    }
}

export class EquipmentState {
    equipment: EquipmentItemState[] = $state([]);

    static fromState(foundState: any) {
        let newState = new this();

        let equipment: EquipmentItemState[] = [];

        for (const foundStateEquipment of foundState.equipment) {
            console.log("?>", foundStateEquipment.equipment);
            equipment.push(EquipmentItemState.fromState(foundStateEquipment));
        }
        console.log(equipment);

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

        console.log(foundState, state);

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

export class ConditionState {
    definition: Condition;
    active: boolean = $state(false);
    value: number = $state(0);

    static fromState(foundState: any) {
        let state = new ConditionState(foundState.definition as Condition);

        state.active = foundState.active;
        state.value = foundState.value;

        return state;
    }

    constructor(definition: Condition) {
        this.definition = definition;
    }

    isActive: boolean = $derived(this.active || this.value > 0);

    toJSON() {
        return {
            definition: this.definition,
            active: this.active,
            value: this.value,
        };
    }
}
