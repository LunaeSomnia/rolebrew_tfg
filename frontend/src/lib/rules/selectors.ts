export type RuleSelector = RuleAttributeSelectors
    | RuleSkillCheckSelectors
    | RuleSkillSelectors
    | RuleSkillDCSelectors
    | RuleDCSelectors
    | RuleGeneralSelectors
    | RuleHpSelectors
    | RuleSpeedSelectors

export type RuleAttributeSelectors = typeof RULE_ATTRIBUTE_SELECTORS[number]
export const RULE_ATTRIBUTE_SELECTORS = [
    "str-based",
    "dex-based",
    "con-based",
    "int-based",
    "wis-based",
    "cha-based",
] as const;

export type RuleSkillCheckSelectors = typeof RULE_SKILL_CHECK_SELECTORS[number]
export const RULE_SKILL_CHECK_SELECTORS = [
    "str-skill-based",
    "dex-skill-based",
    "con-skill-based",
    "int-skill-based",
    "wis-skill-based",
    "cha-skill-based",
] as const;

export type RuleSkillSelectors = typeof RULE_SKILL_SELECTORS[number]
export const RULE_SKILL_SELECTORS = [
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
] as const;

export type RuleSkillDCSelectors = typeof RULE_SKILL_DC_SELECTORS[number]
export const RULE_SKILL_DC_SELECTORS = [
    "acrobatics-dc",
    "arcana-dc",
    "athletics-dc",
    "crafting-dc",
    "deception-dc",
    "diplomacy-dc",
    "intimidation-dc",
    "medicine-dc",
    "nature-dc",
    "occultism-dc",
    "performance-dc",
    "religion-dc",
    "society-dc",
    "stealth-dc",
    "survival-dc",
    "thievery-dc",
] as const;

export type RuleDCSelectors = typeof RULE_DC_SELECTORS[number]
export const RULE_DC_SELECTORS = ["fortitude-dc", "reflex-dc", "will-dc"] as const;

export type RuleGeneralSelectors = typeof RULE_GENERAL_SELECTORS[number]
export const RULE_GENERAL_SELECTORS = [
    "initiative",
    "perception-dc",
    "class",
    "inline-dc",
    "ac",
    "spell-dc",
    "check",
    "hero-points", //
    // "{tradition}-spell-dc" TODO
] as const;

export type RuleHpSelectors = typeof RULE_HP_SELECTORS[number]
export const RULE_HP_SELECTORS = [
    "hp",
    "temp-hp", //
    "hp-per-level",
    "damage-received",
    "healing-received",
] as const;

export type RuleSpeedSelectors = typeof RULE_SPEED_SELECTORS[number]
export const RULE_SPEED_SELECTORS = [
    "all-speeds",
    "land-speed",
    "burrow-speed",
    "climb-speed",
    "fly-speed",
    "swim-speed",
] as const;
