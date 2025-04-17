import { Exclude, Expose, Transform, Type } from "class-transformer";
import { parseBoost, type Boost, type Flaw } from "./secondary/boost";
import type { Item } from "./secondary/item";
import { extractLastUuid, extractTypeLinkFromText } from "./utils/uuid";
import type { Publication } from "./secondary/publication";
import { mapToRule, type RuleType } from "./secondary/rule";
import { ANCESTRY_FEATURES, ANCESTRY_JOURNAL, HERITAGES } from ".";
import { exit } from "node:process";
import {
    assignHeaderIds,
    cleanupHTML,
    extractHeaderSection,
    extractUntilHeader,
    stepHeaders,
} from "./utils/html";
import { parseFragment } from "parse5";
import { Feat } from "./feat";

export class Ancestry {
    @Expose({ name: "_id" }) fvttId!: string;

    name!: string;

    @Transform(({ obj }) => obj.system.additionalLanguages)
    @Expose()
    additionalLanguages!: {
        count: number;
        custom: string;
        value: string[];
    };

    @Transform(({ obj }) => {
        type KeyValue = { key: string; value: any };
        const result: KeyValue[] = [];

        Object.entries(obj.system.boosts).forEach((value, _i) => {
            result.push({ key: value[0], value: value[1] } as KeyValue);
        });

        return result.map((v) => parseBoost(v)).filter((v) => v !== undefined);
    })
    @Expose()
    boosts!: Record<string, Boost>;

    @Transform(({ obj }) => {
        type KeyValue = { key: string; value: any };
        const result: KeyValue[] = [];

        Object.entries(obj.system.boosts).forEach((value, _i) => {
            result.push({ key: value[0], value: value[1] } as KeyValue);
        });

        return result
            .map((v) => {
                if (v.value.value.length === 0) {
                    return undefined;
                } else if (v.value.value.length === 1) {
                    return {
                        type: "grant",
                        flaw: v.value.value[0] as string,
                    } as Flaw;
                } else if (v.value.value.length === 6) {
                    return {
                        type: "free",
                    } as Flaw;
                } else {
                    return {
                        type: "choose",
                        flaws: v.value.value,
                    } as Flaw;
                }
            })
            .filter((v) => v !== undefined);
    })
    @Expose()
    flaws!: Record<string, Flaw>;

    @Transform(({ obj }) => obj.system.hp)
    @Expose()
    hp!: number;

    @Transform(({ obj }) => obj.system.reach)
    @Expose()
    reach!: number;

    @Transform(({ obj }) => obj.system.rules.map((v: any) => mapToRule(v)))
    @Expose()
    rules!: any[];

    @Transform(({ obj }) => obj.system.size)
    @Expose()
    size!: string;

    @Transform(({ obj }) => obj.system.traits.rarity)
    @Expose()
    rarity!: string;

    @Transform(({ obj }) => obj.system.traits.value)
    @Expose()
    traits!: string[];

    @Transform(({ obj }) => obj.system.vision)
    @Expose()
    vision!: string;

    @Transform(({ obj }) => obj.system.slug)
    @Expose()
    slug!: string;

    @Transform(({ obj }) => {
        let swimSpeed = null;
        const swimRule = obj.system.rules.find(
            (v: any) => v.key === "BaseSpeed" && v.selector === "swim",
        );
        if (swimRule) {
            swimSpeed = swimRule.value;
        }
        return {
            walk: obj.system.speed,
            swim: swimSpeed,
        };
    })
    @Expose()
    speed!: any;

    @Transform(({ obj }) => obj.system.languages)
    @Expose()
    languages!: any;

    @Transform(({ obj }) => obj.system.items)
    @Expose({ name: "items" })
    @Transform(({ obj }) => {
        type KeyValue = { key: string; value: any };
        const result: KeyValue[] = [];

        Object.entries(obj.system.items).forEach((value, _i) => {
            result.push({ key: value[0], value: value[1] } as KeyValue);
        });

        const items = result.map((v) => {
            return {
                refSlug: v.key,
                img: v.value.img,
                level: Number.parseInt(v.value.level),
                name: v.value.name,
                uuid: v.value.uuid,
            } as Item;
        }) as Item[];

        return items.map((item) => {
            const uuid = extractLastUuid(item.uuid);
            const feature = ANCESTRY_FEATURES.get(uuid);
            if (feature) {
                return feature;
            }

            throw new Error(
                `assert failed: ancestry feature '${item.name}' of ancestry '${obj.system.slug}'  not found`,
            );
        });
    })
    @Type(() => Feat)
    features!: Feat[];

    @Transform(({ obj }) => obj.system.publication)
    @Expose()
    publication!: Publication;

    @Transform(({ obj }) => {
        const heritages = Array.from(HERITAGES.values())
            .filter((v) => v.ancestrySlug === obj.system.slug)
            .map((v) => {
                return {
                    uuid: v.slug,
                    name: v.name,
                } as Item;
            });

        return heritages;
    })
    @Expose()
    heritages!: Item[];

    @Transform(({ obj }) => {
        const links = extractTypeLinkFromText(obj.system.description.value);
        const journalPageLink = links.pop();
        if (!journalPageLink) {
            throw new Error(
                `assert failed: no journal page link found for ancestry ${obj.name}`,
            );
        }

        const journalPage = ANCESTRY_JOURNAL.get(
            extractLastUuid(journalPageLink.uuid),
        );
        if (!journalPage) {
            throw new Error(
                `assert failed: no journal page found for journal page link ${journalPageLink.uuid}`,
            );
        }

        const description = journalPage.text;

        const heritages = extractHeaderSection(description, "heritages");
        const mechanics = extractHeaderSection(description, "mechanics");

        let roleplaying = description
            .replace(heritages, "")
            .replace(mechanics, "");

        roleplaying = stepHeaders(roleplaying);
        roleplaying = assignHeaderIds(roleplaying);
        roleplaying = cleanupHTML(roleplaying);

        return {
            summary: obj.system.description.value,
            roleplaying,
        };
    })
    @Expose()
    description!: {
        summary: string;
        roleplaying: string;
    };

    //

    @Exclude() effects!: any[];
    @Exclude() img!: string;
    @Exclude() system!: any;
    @Exclude() _stats!: any;
}
