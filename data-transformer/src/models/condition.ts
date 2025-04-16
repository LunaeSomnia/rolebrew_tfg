import { Exclude, Expose, Transform } from "class-transformer";
import type { Publication } from "./secondary/publication";
import { assignHeaderIds, cleanupHTML, stepHeaders } from "./utils/html";
import { mapToRule } from "./secondary/rule";

export class Condition {
    @Expose({ name: "_id" }) fvttId!: string;
    name!: string;
    type!: string;

    @Transform(({ obj }) => obj.system.group)
    @Expose()
    group?: string;

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
        type ConditionDuration = {
            expiry?: boolean;
            perpetual?: boolean;
            text?: string;
            unit: string;
            value: number;
        };
        const durationObj = obj.system.duration as ConditionDuration;
        return durationObj;
    })
    @Expose()
    duration!: any;

    @Transform(({ obj }) => obj.system.overrides)
    @Expose()
    overrides?: string[];

    @Transform(({ obj }) => obj.system.publication)
    @Expose()
    publication!: Publication;

    @Transform(({ obj }) => obj.system.removable)
    @Expose()
    removable?: boolean;

    @Transform(({ obj }) => obj.system.rules.map((v: any) => mapToRule(v)))
    @Expose()
    rules!: any[];

    @Transform(({ obj }) => obj.system.slug)
    @Expose()
    slug!: string;

    @Transform(({ obj }) => obj.system.value.value)
    @Expose()
    value?: number;

    @Exclude() effects!: null;
    @Exclude() _stats!: null;
    @Exclude() img!: null;
    @Exclude() system!: null;
}

export class ConditionDuration {
    perpetual?: boolean;
    text?: string;
    unit!: string;
    value!: number;
}
