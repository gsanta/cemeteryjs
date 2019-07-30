import { WorldItemInfo } from "../../WorldItemInfo";


export interface Importer {
    import(strWorld: string): Promise<WorldItemInfo[]>;
}