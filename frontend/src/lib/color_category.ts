import type { SummaryDataTagCategory } from "./bindings";

enum PossibleColors {
    Neutral = "neutral",
    Orange = "orange",
    Blue = "blue",
    Red = "red",
    Yellow = "yellow",
    Purple = "purple",
    Green = "green",
}

export const COLOR_CATEGORIES: Map<SummaryDataTagCategory, Map<string, PossibleColors>> = new Map([
    ["rarity", new Map([
        ["common", PossibleColors.Neutral],
        ["uncommon", PossibleColors.Orange],
        ["rare", PossibleColors.Blue],
        ["unique", PossibleColors.Purple],
    ])]
])

export function getColorByCategory(category: SummaryDataTagCategory, value: string): PossibleColors {
    return COLOR_CATEGORIES.get(category)?.get(value) ?? PossibleColors.Neutral
}