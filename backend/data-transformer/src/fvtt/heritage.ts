import { Exclude, Expose, Transform } from "class-transformer";
import type { Publication } from "../models/secondary/publication";
import { mapToRule, type RuleType } from "../models/secondary/rule";

export class FvttHeritage {
    @Expose({ name: "_id" }) fvttId!: string;

    name!: string;

    @Transform(({ obj }) => obj.system.slug)
    @Expose()
    slug!: string;

    @Transform(({ obj }) =>
        obj.system.ancestry ? obj.system.ancestry.slug : "",
    )
    @Expose()
    ancestrySlug!: string;

    @Transform(({ obj }) => obj.system.publication)
    @Expose()
    publication!: Publication;

    @Transform(({ obj }) => obj.system.rules.map((v: any) => mapToRule(v)))
    @Expose()
    rules!: RuleType[];

    @Transform(({ obj }) => obj.system.traits.rarity)
    @Expose()
    rarity!: string;

    @Transform(({ obj }) => obj.system.traits.value)
    @Expose()
    traits!: string[];

    @Exclude() description!: null;
    @Exclude() folder!: null;
    @Exclude() _stats!: null;
    @Exclude() type!: null;
    @Exclude() img!: null;
    @Exclude() system!: null;
}
