import { Registry } from "../Registry";
import { AbstractCanvasPlugin } from "./AbstractCanvasPlugin";
import { AbstractService } from "../services/AbstractService";

export class AbstractPluginService<T extends AbstractCanvasPlugin> extends AbstractService {
    protected plugin: AbstractCanvasPlugin;

    constructor(plugin: T, registry: Registry) {
        super(registry);
        this.plugin = plugin;
    }
}