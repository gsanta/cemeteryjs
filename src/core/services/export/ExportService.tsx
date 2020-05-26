import { Registry } from '../../Registry';
import { ActionConceptExporter } from './ActionConceptExporter';
import { IConceptExporter } from './IConceptExporter';
import { MeshConceptExporter } from './MeshConceptExporter';
import { ModelConceptExporter } from './ModelConceptExporter';
import { PathConceptExporter } from './PathConceptExporter';
import ReactDOMServer = require('react-dom/server');

export interface ViewExporter {
    export(): string;
}

export class ExportService {
    serviceName = 'export-service';
    conceptExporters: IConceptExporter[] = [];

    private registry: Registry;

    meshConceptExporter: MeshConceptExporter;
    pathConceptExporter: PathConceptExporter;
    actionConceptExporter: ActionConceptExporter;

    constructor(registry: Registry) {
        this.registry = registry;

        this.meshConceptExporter = new MeshConceptExporter(registry);
        this.pathConceptExporter = new PathConceptExporter(registry);
        this.actionConceptExporter = new ActionConceptExporter(registry);

        this.conceptExporters = [
            new ModelConceptExporter(registry),
            this.meshConceptExporter,
            this.pathConceptExporter,
            this.actionConceptExporter
        ];
    }

    export(): string {
        const viewExporters = this.registry.services.layout.getAllViews().filter(v => v.exporter).map(v => v.exporter);

        const views = viewExporters.map(exporter => ReactDOMServer.renderToStaticMarkup(exporter.export())).join('');
        const concepts = this.conceptExporters.map(exporter => ReactDOMServer.renderToStaticMarkup(exporter.exportToFile())).join('');

        const startTag = '<svg data-wg-width="3000" data-wg-height="3000" width="1000" height="1000">';
        const closeTag =  '</svg>';
        return (
            `${startTag}` +
            `<g data-export-group="view">${views}</g>` +
            `<g data-export-group="concept">${concepts}</g>` +
            `${closeTag}`
        );
    }
}