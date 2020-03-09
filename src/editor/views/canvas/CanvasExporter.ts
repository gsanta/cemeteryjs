import { IConceptExporter } from "./tools/IConceptExporter";
import { Stores } from "../../stores/Stores";
import { RectangleExporter } from "../../services/export/RectangleExporter";
import { PathExporter } from "../../services/export/PathExporter";
import { ConceptType } from "./models/concepts/Concept";
import * as ReactDOMServer from 'react-dom/server';

export class CanvasExporter {
    private conceptExporters: IConceptExporter[];

    constructor(getStores: () => Stores) {
        this.conceptExporters = [new RectangleExporter(getStores), new PathExporter(getStores)];
    }

    export(): string {
        return this.conceptExporters.map(exporter => ReactDOMServer.renderToStaticMarkup(exporter.export())).join('');
    }

    getViewExporter(viewType: ConceptType) {
        return this.conceptExporters.find(exporter => exporter.type === viewType);
    }

    getAllViewExporter(): IConceptExporter[] {
        return this.conceptExporters;
    }
}