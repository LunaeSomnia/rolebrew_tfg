import { Exclude, Expose, Transform, Type } from "class-transformer";
import { DamageRoll } from "./secondary/damage";
import { assignHeaderIds, cleanupHTML, stepHeaders } from "./utils/html";
import type { Publication } from "./secondary/publication";
import { mapToRule } from "./secondary/rule";

export class Equipment {
    @Expose({ name: "_id" }) fvttId!: string;
    name!: string;
    type!: string;

    @Transform(({ obj }) => obj.system.acBonus)
    @Expose()
    acBonus?: number;

    @Transform(({ obj }) => {
        return obj.system.apex ? obj.system.apex.attribute : undefined
    })
    @Expose()
    apex?: string; // attribute

    @Transform(({ obj }) => obj.system.baseItem)
    @Expose()
    baseItem?: string;

    @Transform(({ obj }) => {
        return obj.system.bonus ? obj.system.bonus.value : undefined
    })
    @Expose()
    bonus?: number;

    @Transform(({ obj }) => {
        type Bulk = {
            capacity: number;
            heldOrStowed: number;
            ignored: number;
            value: number;
        };
        const bulkObj = obj.system.bulk as Bulk
        return bulkObj
    })
    @Expose()
    bulk?: any;

    @Transform(({ obj }) => obj.system.category)
    @Expose()
    category?: string;

    @Transform(({ obj }) => obj.system.checkPenalty)
    @Expose()
    checkPenalty?: number;

    @Transform(({ obj }) => obj.system.damage)
    @Type(() => DamageRoll)
    @Expose()
    damage?: DamageRoll;

    @Transform(({ obj }) => {
        let description = obj.system.description.value;
        description = stepHeaders(description);
        description = assignHeaderIds(description);
        description = cleanupHTML(description);
        return description;
    })
    @Expose()
    description!: string;

    @Transform(({ obj }) => obj.system.dexCap)
    @Expose()
    dexCap?: number;

    @Transform(({ obj }) => {
        return obj.system.equipped ? obj.system.equipped.carryType : undefined
    })
    @Expose()
    carryType?: string;

    @Transform(({ obj }) => obj.system.group)
    @Expose()
    group?: string;

    // @Transform(({ obj }) => obj.system.items)
    // @Expose({ name: "items" })
    // @Type(() => Feat)
    // features!: Feat[];

    @Transform(({ obj }) => {
        return obj.system.level ? obj.system.level.value : undefined
    })
    @Expose()
    level?: number;

    @Transform(({ obj }) => {
        let priceObj = obj.system.price;
        return {
            per: priceObj.per,
            cp: priceObj.value.cp,
            gp: priceObj.value.gp,
            sp: priceObj.value.sp
        }
    })
    @Expose()
    price?: any;

    @Transform(({ obj }) => obj.system.publication)
    @Expose()
    publication!: Publication;

    @Transform(({ obj }) => obj.system.quantity)
    @Expose()
    quantity?: number;

    @Transform(({ obj }) => {
        if (obj.system.range && typeof (obj.system.range) !== 'number') {
            return undefined
        }
        return obj.system.range
    })
    @Expose()
    range?: number;

    @Transform(({ obj }) => obj.system.rules.map((v: any) => mapToRule(v)))
    @Expose()
    rules!: any[];

    @Transform(({ obj }) => {
        type Runes = {
            potency?: number;
            property?: string[];
            reinforcing?: number;
            resilient?: number;
            striking?: number;
        };
        const runesObj = obj.system.runes as Runes
        return runesObj
    })
    @Expose()
    runes?: any;

    @Transform(({ obj }) => obj.system.size)
    @Expose()
    size?: string;

    @Transform(({ obj }) => obj.system.slug)
    @Expose()
    slug!: string;

    // TODO: specific

    @Transform(({ obj }) => obj.system.speedPenalty)
    @Expose()
    speedPenalty?: number;

    // TODO: spell

    @Transform(({ obj }) => {
        return obj.system.splashDamage && typeof (obj.system.splashDamage) === 'number' ? obj.system.splashDamage.value : undefined
    })
    @Expose()
    splashDamage?: number;

    @Transform(({ obj }) => obj.system.stackGroup)
    @Expose()
    stackGroup?: string;

    @Transform(({ obj }) => obj.system.stowing)
    @Expose()
    stowing?: boolean;

    @Transform(({ obj }) => obj.system.strength)
    @Expose()
    strength?: number;

    @Transform(({ obj }) => obj.system.traits.rarity)
    @Expose()
    rarity!: string;

    @Transform(({ obj }) => obj.system.traits.value)
    @Expose()
    traits!: string[];

    @Transform(({ obj }) => {
        type Usage = {
            canBeAmmo?: boolean;
            value: string;
        };
        const usageObj = obj.system.usage as Usage
        return usageObj
    })
    @Expose()
    usage?: any;

    @Transform(({ obj }) => {
        type Uses = {
            autoDestroy?: boolean;
            max: number;
            value: number;
        };
        const usesObj = obj.system.uses as Uses
        return usesObj
    })
    @Expose()
    uses?: any;

    @Exclude() effects!: null;
    @Exclude() _stats!: null;
    @Exclude() img!: null;
    @Exclude() system!: null;
}