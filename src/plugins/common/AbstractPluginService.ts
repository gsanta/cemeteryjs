import { Registry } from "../../core/Registry";
import { AbstractCanvasPlugin } from "../../core/plugins/AbstractCanvasPlugin";
import { AbstractService } from "../../core/services/AbstractService";

export class AbstractPluginService<T extends AbstractCanvasPlugin> extends AbstractService {
    protected plugin: AbstractCanvasPlugin;

    constructor(plugin: T, registry: Registry) {
        super(registry);
        this.plugin = plugin;
    }
}