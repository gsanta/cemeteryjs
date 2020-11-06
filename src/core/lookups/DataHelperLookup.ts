import { Registry } from "../Registry";
import { NodeHelper } from "./NodeHelper";


export class DataHelperLookup {

    node: NodeHelper;

    constructor(registry: Registry) {
        this.node = new NodeHelper(registry);
    }

}