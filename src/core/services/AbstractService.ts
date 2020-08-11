import { Registry } from "../Registry";

export class AbstractService {
    serviceName: string;
    protected registry: Registry;

    constructor(registry: Registry) {
        this.registry = registry;
    }

    awake() {}
    destroy() {}
}