import { Exclude, Expose, Transform, Type } from "class-transformer";
import { assignHeaderIds, cleanupHTML, stepHeaders } from "./utils/html";
import type { Publication } from "./secondary/publication";
import { Feat } from "./feat";
import { CLASS_FEATURES } from ".";
import { extractLastUuid } from "./utils/uuid";
import type { Item } from "./secondary/item";
import { mapToRule } from "./secondary/rule";

export class Class {
    @Expose({ name: "_id" }) fvttId!: string;
    name!: string;

    @Transform(({ obj }) => obj.system.ancestryFeatLevels.value)
    @Expose()
    ancestryFeatLevels!: number[];

    @Transform(({ obj }) => {
        return {
            unarmed: obj.system.attacks.unarmed,
            simple: obj.system.attacks.simple,
            martial: obj.system.attacks.martial,
            advanced: obj.system.attacks.advanced,
            other: obj.system.attacks.other,
        };
    })
    @Expose()
    attacks!: any;

    @Transform(({ obj }) => obj.system.classFeatLevels.value)
    @Expose()
    classFeatLevels!: number[];

    @Transform(({ obj }) => {
        return {
            unarmored: obj.system.defenses.unarmored,
            light: obj.system.defenses.light,
            medium: obj.system.defenses.medium,
            heavy: obj.system.defenses.heavy,
        };
    })
    @Expose()
    defenses!: any;

    @Transform(({ obj }) => {
        let description = obj.system.description.value;
        description = stepHeaders(description);
        description = assignHeaderIds(description);
        description = cleanupHTML(description);
        return description;
    })
    @Expose()
    description!: string;

    @Transform(({ obj }) => obj.system.generalFeatLevels.value)
    @Expose()
    generalFeatLevels!: number[];

    @Transform(({ obj }) => obj.system.hp)
    @Expose()
    hp!: number;

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
            const feature = CLASS_FEATURES.get(uuid);
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

    @Transform(({ obj }) => obj.system.keyAbility.value)
    @Expose()
    keyAbility!: string[];

    @Transform(({ obj }) => obj.system.perception)
    @Expose()
    perception!: number;

    @Transform(({ obj }) => obj.system.publication)
    @Expose()
    publication!: Publication;

    @Transform(({ obj }) => obj.system.rules.map((v: any) => mapToRule(v)))
    @Expose()
    rules!: any[];

    @Transform(({ obj }) => obj.system.savingThrows)
    @Expose()
    savingThrows!: any;

    @Transform(({ obj }) => obj.system.skillFeatLevels.value)
    @Expose()
    skillFeatLevels!: number[];

    @Transform(({ obj }) => obj.system.skillIncreaseLevels.value)
    @Expose()
    skillIncreaseLevels!: number[];

    @Transform(({ obj }) => obj.system.spellcasting === 1)
    @Expose()
    spellcasting!: any;

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

    @Exclude() effects!: null;
    @Exclude() _stats!: null;

    @Exclude() img!: null;
    @Exclude() system!: null;
}
