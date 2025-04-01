import { plainToInstance, type ClassConstructor } from "class-transformer";
import { Ancestry } from "./ancestry";
import { Heritage } from "./heritage";
import { nameToSlug } from "../utils/testTransform";
import { Journal, type JournalPage } from "./journals";
import { Feat } from "./feat";
import { Action } from "./action";
import { Class } from "./class";
import { Background } from "./background";

export const FEATS: Map<string, Feat> = new Map();
export const FEATS_LOCATION = "./data/feats.json";

export const ANCESTRY_FEATURES: Map<string, Feat> = new Map();
export const ANCESTRY_FEATURES_LOCATION = "./data/ancestryfeatures.json";

export const ANCESTRY_JOURNAL: Map<string, JournalPage> = new Map();
export const ANCESTRY_JOURNALS_LOCATION = "./data/journals.json";

export const ANCESTRIES: Map<string, Ancestry> = new Map();
export const ANCESTRIES_LOCATION = "./data/ancestries.json";

export const HERITAGES: Map<string, Heritage> = new Map();
export const HERITAGES_LOCATION = "./data/heritages.json";

export const CLASS_FEATURES: Map<string, Feat> = new Map();
export const CLASS_FEATURES_LOCATION = "./data/classfeatures.json";

export const CLASSES: Map<string, Class> = new Map();
export const CLASSES_LOCATION = "./data/classes.json";

export const BACKGROUNDS: Map<string, Background> = new Map();
export const BACKGROUNDS_LOCATION = "./data/backgrounds.json";

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
        map.set(keyFn(transformed), transformed);
    }
}

// Feats
await transformToMap(FEATS, Feat, (v) => v.fvttId, FEATS_LOCATION);
await transformToMap(
    ANCESTRY_FEATURES,
    Feat,
    (v) => v.fvttId,
    ANCESTRY_FEATURES_LOCATION,
);
await transformToMap(
    CLASS_FEATURES,
    Feat,
    (v) => v.fvttId,
    CLASS_FEATURES_LOCATION,
);

// journals
const jsonData: any[] = await Bun.file(ANCESTRY_JOURNALS_LOCATION).json();
for (const ancestry of jsonData) {
    const transformed = plainToInstance(Journal, ancestry);
    for (const page of transformed.pages) {
        ANCESTRY_JOURNAL.set(page.id, page);
    }
}

await transformToMap(
    HERITAGES,
    Heritage,
    (v) => nameToSlug(v.slug),
    HERITAGES_LOCATION,
);

await transformToMap(
    ANCESTRIES,
    Ancestry,
    (v) => nameToSlug(v.slug),
    ANCESTRIES_LOCATION,
);

await transformToMap(
    CLASSES,
    Class,
    (v) => nameToSlug(v.slug),
    CLASSES_LOCATION,
);

await transformToMap(
    ACTIONS,
    Action,
    (v) => nameToSlug(v.slug),
    ACTIONS_LOCATION,
);

await transformToMap(
    BACKGROUNDS,
    Background,
    (v) => nameToSlug(v.slug),
    BACKGROUNDS_LOCATION,
);
