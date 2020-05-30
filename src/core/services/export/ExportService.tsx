import { Registry } from '../../Registry';
import { ActionConceptExporter } from './ActionConceptExporter';
import { IConceptExporter } from './IConceptExporter';
import { MeshViewExporter } from '../../../plugins/scene_editor/io/export/MeshViewExporter';

export interface ViewExporter {
    export(): string;
}

export class ExportService {
    serviceName = 'export-service';
    private registry: Registry;

    constructor(registry: Registry) {
        this.registry = registry;
    }

    export(): string {
        const serializedPlugins = this.registry.services.plugin.plugins.filter(plugin => plugin.exporter).map(plugin => plugin.exporter.export()); 

        const startTag = '<svg data-wg-width="3000" data-wg-height="3000" width="1000" height="1000">';
        const closeTag =  '</svg>';
        return (
            `${startTag}` +
                `<g data-export-group="plugins">
                    ${serializedPlugins}
                </g>` +
            `${closeTag}`
        );
    }
}