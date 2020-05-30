import { Registry } from "../../../core/Registry";
import { IPluginExporter } from "../../common/io/IPluginExporter";
import { IViewExporter } from "../../common/io/IViewExporter";
import { NodeEditorPlugin } from "../NodeEditorPlugin";
import { NodeConnectionViewExporter } from './NodeConnectionViewExporter';
import { NodeViewExporter } from './NodeViewExporter';

export class NodeEditorExporter implements IPluginExporter {
    viewExporters: IViewExporter[];
    private plugin: NodeEditorPlugin;

    constructor(plugin: NodeEditorPlugin, registry: Registry) {
        this.plugin = plugin;

        this.viewExporters = [
            new NodeViewExporter(registry),
            new NodeConnectionViewExporter(registry)
        ];
    }

    export(): string {
        const views = this.viewExporters.map(exporter => exporter.export());

        return (
            `<g data-plugin-id="${this.plugin.getId()}">
                ${views}
            </g>`
        );
    }
}