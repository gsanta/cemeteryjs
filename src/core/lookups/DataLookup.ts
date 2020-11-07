import { Registry } from "../Registry";
import { DataHelperLookup } from "./DataHelperLookup";
import { ViewLookup } from "./ViewLookup";


export class DataLookup {

    helper: DataHelperLookup;
    view: ViewLookup;
    
    constructor(registry: Registry) {
        this.helper = new DataHelperLookup(registry);
        this.view = new ViewLookup(registry);
    }
}