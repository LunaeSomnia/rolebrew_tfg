import { Exclude, Expose, plainToInstance, Transform } from "class-transformer";
import type { EntryData } from "./utils/referencedPage";

export class Pf2eAncestry {
    source!: string;
    page!: number;
    speed!: {
        walk: number;
    };
    languages!: string[];
    features!: {
        name: string;
        unarmedAttack: boolean;
        entries: any[];
    }[];
    heritage!: any[];

    @Transform(({ obj }) => {
        return {
            flavor: obj.flavor,
            info: obj.info,
            heritageInfo: obj.heritageInfo,
        };
    })
    @Expose()
    description!: {
        flavor: EntryData;
        info: EntryData;
        heritageInfo: EntryData;
    };

    @Transform(({ obj }) => obj.summary.text)
    @Expose()
    summary!: any;

    @Transform(({ obj }) => obj.summary.images)
    @Expose()
    img!: string[];

    @Exclude() name!: string;
    @Exclude() rarity!: string;
    @Exclude() hp!: number;
    @Exclude() size!: string[];
    @Exclude() boosts!: string[];
    @Exclude() flaw!: string[];
    @Exclude() traits!: string[];
    @Exclude() flavor!: any;
    @Exclude() info!: any;
    @Exclude() heritageInfo!: any;
}
