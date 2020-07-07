import { AbstractPlugin } from "../../core/AbstractPlugin";
import { Registry } from "../../core/Registry";


export abstract class AbstractPluginComponentFactory<T extends AbstractPlugin> {
    protected plugin: T;
    protected registry: Registry;

    constructor(registry: Registry, plugin: T) {
        this.registry = registry;
        this.plugin = plugin;
    }
    
    abstract renderSidePanelComponent(): JSX.Element;

    renderMainComponent(): JSX.Element {
        throw new Error(`Plugin ${this.plugin.id} does not render a main component.`);
    }

    renderDialogComponent(): JSX.Element {
        return undefined;
    }
}