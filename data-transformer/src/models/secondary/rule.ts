import "reflect-metadata";
import "es6-shim";
import {
    Exclude,
    Expose,
    plainToInstance,
    Transform,
    Type,
} from "class-transformer";
import { exit } from "process";
import type { Damage } from "./damage";
import { possiblyTranslate } from "../../utils/lang";

export function mapToRule(obj: any): RuleType {
    switch (obj.key) {
        case CHOICE_SET_NAME:
            return plainToInstance(ChoiceSetRule, obj);

        default:
            return obj
    }
}

export class RulePredicate { }

export type RuleType =
    | ChoiceSetRule
    | any;

export class Rule {
    key!: string;
}

const ACTIVE_EFFECT_LIKE_NAME = "ActiveEffectLike";
export class ActiveEffectLikeRule extends Rule {
    @Exclude() priority!: number;
    mode!: string;
    path!: string;
    value!: any;
}

const STRIKE_NAME = "Strike";
export class StrikeRule extends Rule {
    damage!: Damage;
    category!: string;
    group!: string;
    img!: string;
    label!: string;
    predicate!: string[];
    traits!: string[];
}

const ROLL_OPTION_NAME = "RollOption";
export class RollOptionRule extends Rule {
    alwaysActive!: boolean;
    mergeable!: boolean;
    toggleable!: boolean;

    label!: string;
    option!: string;
    predicate!: any;
    suboptions!: Map<string, RuleChoice>;
    @Exclude() priority!: any;
    @Exclude() placement!: any;
}

const BASE_SPEED_NAME = "BaseSpeed";
export class BaseSpeedRule extends Rule {
    selector!: string;
    value!: number;
}

const GRANT_ITEM_NAME = "GrantItem";
export class GrantItemRule extends Rule {
    uuid!: string;
}

const ITEM_ALTERATION_NAME = "ItemAlteration";
export class ItemAlterationRule extends Rule {
    itemType!: string;
    mode!: string;
    predicate!: string[];
    property!: string;
    @Transform(({ obj }) => {
        const value = obj.value;
        if (Array.isArray(value)) {
            const newValue = value.map((v: any) => v.text);
            Object.assign(value, newValue);
            return value;
        }
        return undefined;
    })
    @Expose()
    textRef?: string[];

    @Transform(({ obj }) => {
        const value = obj.value;
        if (Array.isArray(value)) {
            return undefined;
        }
    })
    @Expose()
    value?: any;
}

const CHOICE_SET_NAME = "ChoiceSet";
export class ChoiceSetRule extends Rule {
    adjustName!: boolean;

    @Type(() => RuleChoice)
    choices!: RuleChoice[];
    flag!: string;

    @Transform(({ obj }) => {
        if (obj.prompt) {
            const translated = possiblyTranslate(obj.prompt);
            return translated
        }
    })
    prompt!: string;

    @Transform(({ obj }) => {
        if (obj.label) {
            const translated = possiblyTranslate(obj.label);
            return translated
        }
    })
    label!: string;
}

export class RuleChoice {
    @Transform(({ obj }) => {
        if (obj.label)
            return possiblyTranslate(obj.label)
    })
    label!: string;

    @Transform(({ obj }) => {
        if (obj.prompt)
            return possiblyTranslate(obj.prompt)
    })
    prompt!: any;
    value!: any;
}

const CREATURE_SIZE_NAME = "CreatureSize";
export class CreatureSizeRule extends Rule {
    value!: string;
}

const FLAT_MODIFIER_NAME = "FlatModifier";
export class FlatModifierRule extends Rule {
    label!: string;
    predicate!: any;
    selector!: string;
    type!: string;
    value!: number;
}

const ADJUST_DEGREE_OF_SUCCESS_NAME = "AdjustDegreeOfSuccess";
export class AdjustDegreeOfSuccessRule extends Rule {
    adjustment!: {
        success: string;
    };
    predicate!: string[];
    selector!: string;
}

const WEAKNESS_NAME = "Weakness";
export class WeaknessRule extends Rule {
    predicate: any;
    type!: string;
    value!: string;
}

const IMMUNITY_NAME = "Immunity";
export class ImmunityRule extends Rule {
    type!: string;
}

const ADJUST_STRIKE_NAME = "AdjustStrike";
export class AdjustStrikeRule extends Rule {
    mode!: string;
    property!: string;
    value!: string;
    definition!: string[];
}

const SENSE_NAME = "Sense";
export class SenseRule extends Rule {
    selector!: string;
}

const RESISTANCE_NAME = "Resistance";
export class ResistanceRule extends Rule {
    type!: string;
    value!: string;
}

const DAMAGE_DICE_NAME = "DamageDice";
export class DamageDiceRule extends Rule {
    override!: {
        dieSize: string;
    };
    selector!: string;
}

const NOTE_NAME = "Note";
export class NoteRule extends Rule {
    predicate!: string[];
    selector!: string[];
    text!: string;
    title!: string;
}

const ACTOR_TRAITS_NAME = "ActorTraits";
export class ActorTraitsRule extends Rule {
    add!: string[];
    remove!: string[];
}

const ADJUST_MODIFIER_NAME = "AdjustModifier";
export class AdjustModifierRule extends Rule {
    suppress!: boolean;

    mode!: string;
    predicate!: string[];
    selector!: string;
    slug!: string;
}

const TOKEN_LIGHT_NAME = "TokenLight";
export class TokenLightRule extends Rule {
    predicate!: string[];
    value!: any;
}

const AURA_NAME = "Aura";
export class AuraRule extends Rule {
    effects!: any;
    radius!: number;
    traits!: string[];
}

const CRAFTING_ENTRY_NAME = "CraftingEntry";
export class CraftingEntryRule extends Rule {
    craftableItems!: string[];
    isDailyPrep!: boolean;
    isPrepared!: boolean;
    name!: string;
    selector!: string;
}
