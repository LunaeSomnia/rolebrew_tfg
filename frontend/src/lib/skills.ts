import type { Attribute, Skill } from "./bindings";

export function skillToAttribute(skill: Skill): Attribute {
    switch (skill) {
        case "athletics":
            return "Strength"
        case "acrobatics":
        case "stealth":
        case "thievery":
            return "Dexterity"
        case "arcana":
        case "occultism":
        case "crafting":
            return "Intelligence"
        case "society":
        case "deception":
        case "diplomacy":
        case "intimidation":
        case "performance":
            return "Charisma"
        case "medicine":
        case "nature":
        case "religion":
        case "survival":
            return "Wisdom"
    }
}