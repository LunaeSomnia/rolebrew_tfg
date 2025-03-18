import { readdir } from "node:fs/promises";
import { Pf2eAncestry } from "./ancestry";
import { plainToInstance } from "class-transformer";
import { nameToSlug } from "../utils/testTransform";

export const PF2ETOOLS_ANCESTRIES: Map<string, Pf2eAncestry> = new Map();
export const PF2ETOOLS_ANCESTRIES_LOCATION = "data/pf2e/ancestries/";

// Read ancestries and parse

const inputDir = await readdir(PF2ETOOLS_ANCESTRIES_LOCATION);
for (const file of inputDir) {
    const jsonData: any = await Bun.file(
        PF2ETOOLS_ANCESTRIES_LOCATION + file,
    ).json();
    if (file.startsWith("ancestry-")) {
        const slug = file.replace("ancestry-", "").replace(".json", "");
        const transformedAncestry = plainToInstance(
            Pf2eAncestry,
            jsonData.ancestry[0],
        );
        PF2ETOOLS_ANCESTRIES.set(nameToSlug(slug), transformedAncestry);
    } else if (file.startsWith("versatile-heritages")) {
        // for (const heritage of jsonData.versatileHeritage) {
        //     const slug = (heritage.name as string).toLowerCase();
        //     const transformedAncestry = plainToInstance(Pf2eAncestry, heritage);
        //     ANCESTRIES.set(slug, transformedAncestry);
        // }
    }
}
