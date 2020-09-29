import { Registry } from "../Registry";

export class AbstractService {
    protected registry: Registry;

    constructor(registry: Registry) {
        this.registry = registry;
    }

    awake() {}
    destroy() {}
}