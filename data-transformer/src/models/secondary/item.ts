import { Expose, Transform } from "class-transformer";

export class Item {
    @Expose() refSlug!: string;
    img!: string;
    @Transform((obj) => {
        if (typeof obj === "number") {
            const newValue = Number.parseInt(obj);
            Object.assign(obj, newValue);
            return newValue;
        }
    })
    @Expose()
    level!: number;
    name!: string;
    uuid!: string;
}
