import { Exclude, Expose } from "class-transformer";

export type EntryData = (string | ReferencedPage)[];

export class ReferencedPage {
    @Exclude() type!: any;
    @Exclude() style!: any;
    @Exclude() activity!: any;
    @Exclude() traits!: any;

    page!: number;
    name!: string;
    shortname!: string;
    reference!: {
        auto: boolean;
    };
    entries!: EntryData;
    items!: string[];
}
