import { Exclude, Expose, Transform } from "class-transformer";
import type { Publication } from "./secondary/publication";
import { mapToRule, type RuleType } from "./secondary/rule";

export class Heritage {
    @Expose({ name: "_id" }) fvttId!: string;
    name!: string;

    @Transform(({ obj }) => obj.system.slug)
    @Expose()
    slug!: string;

    @Transform(({ obj }) => obj.system.description.value)
    @Expose()
    description!: string;

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

    @Exclude() effects!: null;
    @Exclude() folder!: null;
    @Exclude() _stats!: null;
    @Exclude() img!: null;
    @Exclude() system!: null;
}
