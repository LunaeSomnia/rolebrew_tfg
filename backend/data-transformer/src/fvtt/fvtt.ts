import { plainToInstance, type ClassConstructor } from "class-transformer";
import { FvttAncestry, FvttAncestryFeature } from "./ancestry";
import { FvttHeritage } from "./heritage";
import { nameToSlug } from "../utils/testTransform";

export const FVTT_ANCESTRY_FEATURES: Map<string, FvttAncestryFeature> =
    new Map();
export const FVTT_ANCESTRY_FEATURES_LOCATION =
    "./data/fvtt/ancestryfeatures.json";

export const FVTT_ANCESTRIES: Map<string, FvttAncestry> = new Map();
export const FVTT_ANCESTRIES_LOCATION = "./data/fvtt/ancestries.json";

export const FVTT_HERITAGES: Map<string, FvttHeritage> = new Map();
export const FVTT_HERITAGES_LOCATION = "./data/fvtt/heritages.json";

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

// Read ancestries and parse

await transformToMap(
    FVTT_ANCESTRY_FEATURES,
    FvttAncestryFeature,
    (v) => v.slug,
    FVTT_ANCESTRY_FEATURES_LOCATION,
);

await transformToMap(
    FVTT_ANCESTRIES,
    FvttAncestry,
    (v) => v.slug,
    FVTT_ANCESTRIES_LOCATION,
);

await transformToMap(
    FVTT_HERITAGES,
    FvttHeritage,
    (v) => v.slug,
    FVTT_HERITAGES_LOCATION,
);
