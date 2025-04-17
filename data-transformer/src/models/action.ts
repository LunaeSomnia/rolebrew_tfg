import { Exclude, Expose, Transform } from "class-transformer";
import { assignHeaderIds, cleanupHTML, stepHeaders } from "./utils/html";
import type { Publication } from "./secondary/publication";

export class Action {
    @Expose({ name: "_id" })
    fvttId!: string;
    name!: string;

    @Transform(({ obj }) => obj.system.actionType.value)
    @Expose()
    actionType!: string;

    @Transform(({ obj }) => obj.system.actions.value)
    @Expose()
    actions!: number;

    @Transform(({ obj }) => obj.system.category)
    @Expose()
    category!: number;

    @Transform(({ obj }) => {
        let description = obj.system.description.value;
        description = stepHeaders(description);
        description = assignHeaderIds(description);
        description = cleanupHTML(description);
        return description;
    })
    @Expose()
    description!: string;

    @Transform(({ obj }) => obj.system.publication)
    @Expose()
    publication!: Publication;

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

    @Exclude() folder!: string;
    @Exclude() img!: string;
    @Exclude() system!: string;
    @Exclude() _stats!: string;
    @Exclude() effects!: string;
}
