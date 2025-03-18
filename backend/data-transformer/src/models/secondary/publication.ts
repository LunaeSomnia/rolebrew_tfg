import { Expose } from "class-transformer";

export class Publication {
    @Expose() license!: string;
    @Expose() remaster!: boolean;
    @Expose() title!: string;
    @Expose() source!: string;
    @Expose() page!: string;
}
