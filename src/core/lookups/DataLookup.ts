import { Registry } from "../Registry";
import { DataHelperLookup } from "./DataHelperLookup";


export class DataLookup {

    helper: DataHelperLookup;
    
    constructor(registry: Registry) {
        this.helper = new DataHelperLookup(registry);
    }
}