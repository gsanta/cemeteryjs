import { IPluginExporter } from "../../../common/io/IPluginExporter";
import { IViewExporter } from "../../../common/io/IViewExporter";
import { SceneEditorPlugin } from "../../SceneEditorPlugin";
import { Registry } from "../../../../core/Registry";
import { MeshViewExporter } from "./MeshViewExporter";
import { PathViewExporter } from "./PathViewExporter";


export class SceneEditorExporter implements IPluginExporter {
    viewExporters: IViewExporter[];
    private plugin: SceneEditorPlugin;

    constructor(plugin: SceneEditorPlugin, registry: Registry) {
        this.plugin = plugin;

        this.viewExporters = [
            new MeshViewExporter(registry),
            new PathViewExporter(registry)
        ];
    }

    export(): string {
        const views = this.viewExporters.map(exporter => exporter.export());

        return (
            `<g data-plugin-id="${this.plugin.getId()}">
                ${views.join('')}
            </g>`
        );
    }
}