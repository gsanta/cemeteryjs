import { AbstractPlugin } from "../../core/AbstractPlugin";


export abstract class AbstractPluginComponentFactory<T extends AbstractPlugin> {
    protected plugin: T;

    constructor(plugin: T) {
        this.plugin = plugin;
    }
    
    abstract renderSidePanelSettingsWhenPluginActive(): JSX.Element;
    abstract renderSidePanelSettingsWhenPluginNotActive(): JSX.Element;
}