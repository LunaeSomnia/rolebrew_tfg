import { Exclude, Expose } from "class-transformer";

export abstract class CompendiumMeta {
    coreVersion!: string;
    systemId!: string;
    systemVersion!: string;
    compendiumSource!: string;
}

export abstract class CompendiumFile {
    @Expose({ name: "_id" }) id!: string;
    img!: string;
    name!: string;
    type!: string;
    @Expose({ name: "_stats" }) meta!: CompendiumMeta;
    effects!: string[];
    @Exclude()
    _stats!: null;
}

//

export class WrappedValue {
    value!: string;
}

export class WrappedArray {
    value!: string[];
}
