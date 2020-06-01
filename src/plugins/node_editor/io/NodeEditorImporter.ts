import { AbstractPluginImporter, PluginJson, ViewContainerJson } from "../../common/io/AbstractPluginImporter";
import { IViewImporter } from "../../../core/services/import/IViewImporter";
import { Registry } from "../../../core/Registry";
import { RectJson } from "../../scene_editor/io/import/MeshViewImporter";
import { ConceptType } from "../../../core/models/views/View";
import { NodeViewImporter } from "./import/NodeViewImporter";

export class NodeEditorImporter extends AbstractPluginImporter {
    viewImporters: IViewImporter<any>[];

    private registry: Registry;

    constructor(registry: Registry) {
        super();
        this.registry = registry;

        this.viewImporters = [
            new NodeViewImporter(this.registry)
        ];
    }

    import(pluginJson: PluginJson): void {
        let viewContainers: ViewContainerJson<RectJson>[] = pluginJson.g.length ? pluginJson.g : [<any> pluginJson.g];

        viewContainers.forEach((viewContainerJson: ViewContainerJson<RectJson>) => {
            const conceptType = <ConceptType> viewContainerJson._attributes["data-view-type"];
            this.findViewImporter(conceptType).import(viewContainerJson)
        });
    }
}