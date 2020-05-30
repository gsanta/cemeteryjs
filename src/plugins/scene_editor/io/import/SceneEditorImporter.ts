import { AbstractPluginImporter, PluginJson, ViewContainerJson } from "../../../common/io/AbstractPluginImporter";
import { Registry } from "../../../../core/Registry";
import { IViewImporter } from "../../../../core/services/import/IViewImporter";
import { ModelViewImporter } from "./ModelViewImporter";
import { PathViewImporter } from "./PathViewImporter";
import { MeshViewImporter, RectJson } from "./MeshViewImporter";
import { ConceptType } from "../../../../core/models/views/View";



export class SceneEditorImporter extends AbstractPluginImporter {
    viewImporters: IViewImporter<any>[];

    private registry: Registry;

    constructor(registry: Registry) {
        super();
        this.registry = registry;

        this.viewImporters = [
            new MeshViewImporter(registry),
            new ModelViewImporter(registry),
            new PathViewImporter(registry)
        ];
    }

    import(pluginJson: PluginJson): void {
        let viewContainers: ViewContainerJson<RectJson>[] = pluginJson.g.length ? [pluginJson.g as any] : pluginJson.g;

        viewContainers.forEach((viewContainerJson: ViewContainerJson<RectJson>) => {
            const conceptType = <ConceptType> viewContainerJson._attributes["data-view-type"];
            this.findViewImporter(conceptType).import(viewContainerJson)
        });
    }
}