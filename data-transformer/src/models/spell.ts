import {
    Exclude,
    Expose,
    plainToInstance,
    Transform,
    Type,
} from "class-transformer";
import { DamageRoll } from "./secondary/damage";
import { assignHeaderIds, cleanupHTML, stepHeaders } from "./utils/html";
import type { Publication } from "./secondary/publication";

export class SpellHeighteningLevel {
    @Transform(({ obj }) => {
        if (!obj.damage) return {};
        const result: Record<string, DamageRoll> = {};

        for (const [key, val] of Object.entries(obj.damage)) {
            result[key] = plainToInstance(DamageRoll, val);
        }

        return result;
    })
    damage?: Record<string, DamageRoll>;

    @Transform(({ obj }) => {
        return obj.range && obj.range.value !== ""
            ? obj.range.value
            : undefined;
    })
    range?: string;

    @Transform(({ obj }) => {
        return obj.area && obj.area !== ""
            ? Number.parseInt(obj.area)
            : undefined;
    })
    area?: any;

    @Transform(({ obj }) => {
        return obj.target && obj.target.value !== ""
            ? obj.target.value
            : undefined;
    })
    target?: string;

    @Transform(({ obj }) => {
        return obj.time && obj.time.value !== "" ? obj.time.value : undefined;
    })
    time?: string;

    @Transform(({ obj }) => {
        return obj.traits && obj.traits.value !== ""
            ? obj.traits.value
            : undefined;
    })
    traits?: string;
}
export class SpellHeightening {
    damage?: Record<string, string>;

    interval?: number;

    type?: string;

    @Transform(({ value }) => {
        if (!value) return {};
        const result: Record<string, SpellHeighteningLevel> = {};

        for (const [key, val] of Object.entries(value)) {
            result[key] = plainToInstance(SpellHeighteningLevel, val);
        }

        return result;
    })
    @Expose()
    levels?: Record<string, SpellHeighteningLevel>;
}

export class Spell {
    @Expose({ name: "_id" })
    fvttId!: string;

    name!: string;

    @Transform(({ obj }) => {
        return obj.area && obj.area !== ""
            ? Number.parseInt(obj.area)
            : undefined;
    })
    @Expose()
    area!: any;

    @Transform(({ obj }) => {
        return obj.system.cost.value !== "" ? obj.system.cost.value : undefined;
    })
    @Expose()
    cost!: string;

    @Transform(({ obj }) => obj.system.counteraction)
    @Expose()
    counteraction!: boolean;

    @Transform(({ obj }) => {
        type KeyValue = { key: string; value: any };
        const result: KeyValue[] = [];

        Object.entries(obj.system.damage).forEach((value, _i) => {
            result.push({ key: value[0], value: value[1] } as KeyValue);
        });

        return result.map((v) => plainToInstance(DamageRoll, v.value));
    })
    @Expose()
    damage!: DamageRoll[];

    @Transform(({ obj }) => obj.system.defense)
    @Expose()
    defense!: any;

    @Transform(({ obj }) => {
        let description = obj.system.description.value;
        description = stepHeaders(description);
        description = assignHeaderIds(description);
        description = cleanupHTML(description);
        return description;
    })
    @Expose()
    description!: string;

    @Transform(({ obj }) => {
        if (!obj.system.heightening) return undefined;
        return plainToInstance(SpellHeightening, obj.system.heightening);
    })
    @Expose()
    heightening?: SpellHeightening;

    @Transform(({ obj }) => obj.system.level.value)
    @Expose()
    level!: number;

    @Transform(({ obj }) => obj.system.publication)
    @Expose()
    publication!: Publication;

    @Transform(({ obj }) => {
        return obj.system.range.value !== ""
            ? obj.system.range.value
            : undefined;
    })
    @Expose()
    range?: string;

    @Transform(({ obj }) => {
        return obj.system.requirements !== ""
            ? obj.system.requirements
            : undefined;
    })
    @Expose()
    requirements?: string;

    @Transform(({ obj }) => {
        return obj.system.target.value !== ""
            ? obj.system.target.value
            : undefined;
    })
    @Expose()
    target?: string;

    @Transform(({ obj }) => obj.system.time.value)
    @Expose()
    time!: string;

    @Transform(({ obj }) => obj.system.rules)
    @Expose()
    rules!: any[];

    @Transform(({ obj }) => obj.system.traits.traditions)
    @Expose()
    traditions!: string[];

    @Transform(({ obj }) => obj.system.traits.rarity)
    @Expose()
    rarity!: string;

    @Transform(({ obj }) => obj.system.traits.value)
    @Expose()
    traits!: string[];

    @Transform(({ obj }) => obj.system.slug)
    @Expose()
    slug!: string;

    @Exclude() folder!: string;
    @Exclude() img!: string;
    @Exclude() system!: string;
    @Exclude() _stats!: string;
    @Exclude() effects!: string;
}
