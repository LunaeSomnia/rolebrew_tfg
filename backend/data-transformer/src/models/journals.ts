import "reflect-metadata";
import "es6-shim";

import { Exclude, Expose, Transform, Type } from "class-transformer";

export class Journal {
    @Expose({ name: "_id" }) id!: string;
    name!: string;
    @Exclude()
    ownership!: { default: boolean };
    @Type(() => JournalPage)
    pages!: JournalPage[];
    @Exclude()
    _stats?: null;
}

export class JournalPage {
    @Expose({ name: "_id" }) id!: string;
    @Exclude()
    image!: {};
    name!: string;
    @Exclude()
    sort?: null;
    @Exclude()
    src?: null;
    @Exclude()
    system?: null;
    // @Exclude()
    // text!: {
    //     content: string;
    //     format: boolean;
    // };
    @Transform(({ obj }) => {
        return obj.text.content;
    })
    text!: string;

    @Exclude()
    title!: { level: number; show: boolean };
    type!: string;
    @Exclude()
    video?: null;
    @Exclude()
    _stats?: null;
}
