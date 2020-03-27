import { Stores } from '../../stores/Stores';
import { IConceptExporter } from './IConceptExporter';
import { MeshConceptExporter } from './MeshConceptExporter';
import { PathConceptExporter } from './PathConceptExporter';
import ReactDOMServer = require('react-dom/server');

export interface ViewExporter {
    export(): string;
}

export class ExportService {
    serviceName = 'export-service';
    private getStores: () => Stores;
    conceptExporters: IConceptExporter[] = [];

    constructor(getStores: () => Stores) {
        this.getStores = getStores;
        this.conceptExporters = [new MeshConceptExporter(getStores), new PathConceptExporter(getStores)];
    }

    export(): string {
        const viewExporters = this.getStores().viewStore.getAllViews().filter(v => v.exporter).map(v => v.exporter);

        const views = viewExporters.map(exporter => ReactDOMServer.renderToStaticMarkup(exporter.export())).join('');
        const concepts = this.conceptExporters.map(exporter => ReactDOMServer.renderToStaticMarkup(exporter.export())).join('');

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