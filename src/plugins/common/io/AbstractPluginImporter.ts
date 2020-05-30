import { ConceptType } from "../../../core/models/views/View";
import { IViewImporter } from "../../../core/services/import/IViewImporter";

export interface PluginJson {
    _attributes: {
        "data-plugin-id": string;
    }

    g: ViewContainerJson<any>[];
}

export interface ViewContainerJson<T> {
    _attributes: {
        "data-view-type": string
    }

    g: T[];
}

export abstract class AbstractPluginImporter {
    viewImporters: IViewImporter<any>[] = [];

    abstract import(plugin: PluginJson): void;

    protected findViewImporter<T>(viewType: ConceptType): IViewImporter<T> {
        return this.viewImporters.find(conceptImporter => conceptImporter.type === viewType);
    }
} 