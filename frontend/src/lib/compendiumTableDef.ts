import type { SummaryData, SummaryDataTagCategory } from "./bindings";

export enum CompendiumSection {
    Ancestry = "ancestry",
    Archetype = "archetype",
    Background = "background",
    Class = "class",
    Feat = "feat",
    Spell = "spell",
    Action = "action",
    Condition = "condition",
    Item = "item",
    Trait = "trait",
    Bestiary = "bestiary",
    QuickReference = "quick-reference",
}

export enum TableSorting {
    None,
    Descending,
    Ascending,
}

export type TableHeaderDef = {
    column: string;
    data_type:
        | { type: "String" }
        | { type: "Number" }
        | { type: "Tag"; category: SummaryDataTagCategory };
};

export const TABLE_HEADERS: Map<CompendiumSection, TableHeaderDef[]> = new Map([
    [
        CompendiumSection.Spell,
        [
            {
                column: "Name",
                data_type: {
                    type: "String",
                },
            } as TableHeaderDef,
        ],
    ],
    [
        CompendiumSection.Class,
        [
            {
                column: "Name",
                data_type: {
                    type: "String",
                },
            } as TableHeaderDef,
        ],
    ],
    [
        CompendiumSection.Background,
        [
            {
                column: "Name",
                data_type: {
                    type: "String",
                },
            } as TableHeaderDef,
        ],
    ],
    [
        CompendiumSection.Action,
        [
            {
                column: "Name",
                data_type: {
                    type: "String",
                },
            } as TableHeaderDef,
        ],
    ],
    [
        CompendiumSection.Feat,
        [
            {
                column: "Name",
                data_type: {
                    type: "String",
                },
            } as TableHeaderDef,
        ],
    ],
    [
        CompendiumSection.Ancestry,
        [
            {
                column: "Name",
                data_type: {
                    type: "String",
                },
            } as TableHeaderDef,
            {
                column: "Rarity",
                data_type: {
                    type: "Tag",
                    category: "rarity",
                },
            } as TableHeaderDef,
            {
                column: "Hit Points",
                data_type: {
                    type: "Number",
                },
            } as TableHeaderDef,
            {
                column: "Size",
                data_type: {
                    type: "String",
                },
            } as TableHeaderDef,
            {
                column: "Speed",
                data_type: {
                    type: "Number",
                },
            } as TableHeaderDef,
            {
                column: "Boosts",
                data_type: {
                    type: "String",
                },
            } as TableHeaderDef,
            {
                column: "Flaws",
                data_type: {
                    type: "String",
                },
            } as TableHeaderDef,
            {
                column: "Source",
                data_type: {
                    type: "String",
                },
            } as TableHeaderDef,
        ],
    ],
]);
