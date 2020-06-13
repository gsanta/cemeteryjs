import { Registry } from "../../core/Registry";
import { AbstractPlugin } from "../../core/AbstractPlugin";
import { AbstractService } from "../../core/AbstractService";

export class AbstractPluginService<T extends AbstractPlugin> extends AbstractService {
    protected plugin: AbstractPlugin;

    constructor(plugin: T, registry: Registry) {
        super(registry);
        this.plugin = plugin;
    }
}