import { Exclude, Expose, Transform } from "class-transformer";
import type { Boost, Flaw } from "../models/secondary/boost";
import type { Item } from "../models/secondary/item";
import { extractLastUuid } from "./utils/uuid";
import type { Publication } from "../models/secondary/publication";
import { mapToRule, type RuleType } from "../models/secondary/rule";
import { FVTT_ANCESTRY_FEATURES } from "./fvtt";
import { nameToSlug } from "../utils/testTransform";

export class FvttAncestry {
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

        return result
            .map((v) => {
                if (v.value.value.length === 0) {
                    return undefined;
                } else if (v.value.value.length === 1) {
                    return {
                        type: "grant",
                        boost: v.value.value[0] as string,
                    } as Boost;
                } else if (v.value.value.length === 6) {
                    return {
                        type: "free",
                    } as Boost;
                } else {
                    return {
                        type: "choose",
                        boosts: v.value.value,
                    } as Boost;
                }
            })
            .filter((v) => v !== undefined);
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
            const feature = FVTT_ANCESTRY_FEATURES.get(nameToSlug(item.name));
            if (feature) {
                return feature;
            }

            const feature2 = FVTT_ANCESTRY_FEATURES.get(
                nameToSlug(item.name + " " + obj.name),
            );
            if (feature2) {
                return feature2;
            }

            throw new Error(
                `assert failed: ancestry feature '${item.name}' of ancestry '${obj.system.slug}'  not found`,
            );
        });
    })
    @Expose()
    items!: FvttAncestryFeature[];

    @Transform(({ obj }) => obj.system.publication)
    @Expose()
    publication!: Publication;

    @Transform(({ obj }) => obj.system.reach)
    @Expose()
    reach!: number;

    @Transform(({ obj }) => obj.system.rules)
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

    //

    @Exclude() effects!: any[];
    @Exclude() img!: string;
    @Exclude() speed!: any;
    @Exclude() languages!: any;
    @Exclude() system!: any;
    @Exclude() type!: any;
    @Exclude() _stats!: any;
}

export class FvttAncestryFeature {
    @Expose({ name: "_id" }) fvttId!: string;

    name!: string;

    @Transform(({ obj }) => obj.system.slug)
    @Expose()
    slug!: string;

    @Transform(({ obj }) => obj.system.traits.rarity)
    @Expose()
    rarity!: string;

    @Transform(({ obj }) => obj.system.traits.value)
    @Expose()
    traits!: string[];

    @Transform(({ obj }) => obj.system.actionType.value)
    @Expose()
    actionType!: string;

    @Transform(({ obj }) => obj.system.rules.map((v: any) => mapToRule(v)))
    @Expose()
    rules!: RuleType[];

    @Transform(({ obj }) => obj.system.traits.selected)
    @Expose()
    selectedTraits!: any;

    @Transform(({ obj }) => obj.system.publication as Publication)
    @Expose()
    publication!: Publication;

    @Exclude() description!: null;
    @Exclude() img!: null;
    @Exclude() system!: null;
    @Exclude() _migration!: null;
}
