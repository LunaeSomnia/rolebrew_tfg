import { plainToInstance, type ClassConstructor } from "class-transformer";
import { Ancestry, AncestryFeature } from "./ancestry";
import { Heritage } from "./heritage";
import { nameToSlug } from "../utils/testTransform";
import { Journal, type JournalPage } from "./journals";
import { Feat } from "./feat";
import { Action } from "./action";

export const FEATS: Map<string, Feat> = new Map();
export const FEATS_LOCATION = "./data/feats.json";

export const ANCESTRY_FEATURES: Map<string, AncestryFeature> = new Map();
export const ANCESTRY_FEATURES_LOCATION = "./data/ancestryfeatures.json";

export const ANCESTRY_JOURNAL: Map<string, JournalPage> = new Map();
export const ANCESTRY_JOURNALS_LOCATION = "./data/journals.json";

export const ANCESTRIES: Map<string, Ancestry> = new Map();
export const ANCESTRIES_LOCATION = "./data/ancestries.json";

export const HERITAGES: Map<string, Heritage> = new Map();
export const HERITAGES_LOCATION = "./data/heritages.json";

export const ACTIONS: Map<string, Action> = new Map();
export const ACTIONS_LOCATION = "./data/actions.json";

async function transformToMap<T>(
    map: Map<string, T>,
    classConstructor: ClassConstructor<T>,
    keyFn: (t: T) => string,
    path: string,
) {
    const jsonData: any[] = await Bun.file(path).json();
    for (const ancestry of jsonData) {
        const transformed = plainToInstance(classConstructor, ancestry);
        map.set(nameToSlug(keyFn(transformed)), transformed);
    }
}

// Feats
await transformToMap(FEATS, Feat, (v) => v.slug, FEATS_LOCATION);

// Read ancestries and parse

await transformToMap(
    ANCESTRY_FEATURES,
    AncestryFeature,
    (v) => v.slug,
    ANCESTRY_FEATURES_LOCATION,
);

// journals
const jsonData: any[] = await Bun.file(ANCESTRY_JOURNALS_LOCATION).json();
for (const ancestry of jsonData) {
    const transformed = plainToInstance(Journal, ancestry);
    for (const page of transformed.pages) {
        ANCESTRY_JOURNAL.set(page.id, page);
    }
}

await transformToMap(HERITAGES, Heritage, (v) => v.slug, HERITAGES_LOCATION);

await transformToMap(ANCESTRIES, Ancestry, (v) => v.slug, ANCESTRIES_LOCATION);

await transformToMap(ACTIONS, Action, (v) => v.slug, ACTIONS_LOCATION);
