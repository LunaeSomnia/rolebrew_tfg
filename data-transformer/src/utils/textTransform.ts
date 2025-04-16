import assert from "assert";

export function nameToSlug(name: string): string {
    return name
        .toLowerCase()
        .replaceAll(/[\(\)\'\.]/g, "")
        .replaceAll(" ", "-");
}

const SOURCE_TO_COMPENDIUM_MAP: Map<string, string> = new Map([
    ["conditionitems", "condition"],
    ["equipment-srd", "equipment"],
    ["spells-srd", "spell"],
    ["feats-srd", "feat"],
    ["ancestryfeatures", "feat"],
    ["classfeatures", "feat"],
    ["adventure-specific-actions", "action"],
    ["actionspf2e", "action"],
]);

export function transform_source(uuid: string): string | null {
    let newUuid = uuid.replace("Compendium.pf2e.", "");
    newUuid = newUuid.replace("Item.", "");

    let split = newUuid.split(".");

    if (split.length !== 2) {
        return uuid;
    }

    let source = split[0];
    let id = split[1];

    let sourceOption = SOURCE_TO_COMPENDIUM_MAP.get(source);
    if (sourceOption !== undefined) {
        return `${source}.${id}`;
    } else {
        return null;
    }
}
