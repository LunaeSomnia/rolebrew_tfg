import { Exclude, Expose, Transform } from "class-transformer";
import type { Publication } from "./secondary/publication";
import { mapToRule } from "./secondary/rule";
import { assignHeaderIds, cleanupHTML, stepHeaders } from "./utils/html";

export class Feat {
    @Expose({ name: "_id" })
    fvttId!: string;

    @Expose()
    name!: string;

    @Transform(({ obj }) => obj.system.actionType.value)
    @Expose()
    actionType!: string;

    @Transform(({ obj }) => obj.system.actions.value)
    @Expose()
    actions!: number;

    @Transform(({ obj }) => obj.system.category)
    @Expose()
    category!: string;

    @Transform(({ obj }) => {
        let description = obj.system.description.value;
        description = stepHeaders(description);
        description = assignHeaderIds(description);
        description = cleanupHTML(description);
        return description;
    })
    @Expose()
    description!: string;

    @Transform(({ obj }) => obj.system.level.value)
    @Expose()
    level!: number;

    @Transform(({ obj }) =>
        obj.system.prerequisites.value.map((v: any) => v.value),
    )
    @Expose()
    prerequisites!: string[];

    @Transform(({ obj }) => obj.system.publication)
    @Expose()
    publication!: Publication;

    // @Transform(({ obj }) => obj.system.rules.map((v: any) => mapToRule(v))) TODO: Check rules
    @Transform(({ obj }) => obj.system.rules)
    @Expose()
    rules!: any[];

    @Transform(({ obj }) => obj.system.traits.rarity)
    @Expose()
    rarity!: string;

    @Transform(({ obj }) => obj.system.traits.value)
    @Expose()
    traits!: string[];

    @Transform(({ obj }) => obj.system.slug)
    @Expose()
    slug!: string;

    @Exclude() system!: any;
    @Exclude() img!: any;
    @Exclude() _stats!: any;
    @Exclude() type!: any;
    @Exclude() effects!: any; // TODO: Check
}
