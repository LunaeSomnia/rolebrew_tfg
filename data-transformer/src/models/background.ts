import { Exclude, Expose, Transform, Type } from "class-transformer";
import { assignHeaderIds, cleanupHTML, stepHeaders } from "./utils/html";
import { extractLastUuid } from "./utils/uuid";
import { FEATS } from ".";
import type { Item } from "./secondary/item";
import { Feat } from "./feat";
import type { Publication } from "./secondary/publication";

export class Background {
    @Expose({ name: "_id" }) fvttId!: string;

    name!: string;

    @Transform(({ obj }) => {
        const map: Record<number, number[]> = {};

        Object.entries(obj.system.boosts).forEach(
            (value: [string, any], _i) => {
                map[Number.parseInt(value[0])] = value[1].value;
            },
        );
        return map;
    })
    @Expose()
    boosts!: Record<number, number[]>;

    @Transform(({ obj }) => {
        let description = obj.system.description.value;
        description = stepHeaders(description);
        description = assignHeaderIds(description);
        description = cleanupHTML(description);
        return description;
    })
    @Expose()
    description!: string;

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
            const feature = FEATS.get(uuid);
            if (feature) {
                return feature;
            }

            throw new Error(
                `assert failed: class feature '${item.name}' of class '${obj.system.slug}'  not found`,
            );
        });
    })
    @Type(() => Feat)
    features!: Feat[];

    @Transform(({ obj }) => obj.system.publication)
    @Expose()
    publication!: Publication;

    @Transform(({ obj }) => obj.system.rules)
    @Expose()
    rules!: any[];

    @Transform(({ obj }) => obj.system.trainedSkills)
    @Expose()
    trainedSkills!: any;

    @Transform(({ obj }) => obj.system.traits.rarity)
    @Expose()
    rarity!: string;

    @Transform(({ obj }) => obj.system.traits.value)
    @Expose()
    traits!: string[];

    @Transform(({ obj }) => obj.system.slug)
    @Expose()
    slug!: string;

    @Exclude() effects!: any[];
    @Exclude() img!: string;
    @Exclude() system!: any;
    @Exclude() type!: any;
    @Exclude() _stats!: any;
}
