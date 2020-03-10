import { IConceptExporter } from "./tools/IConceptExporter";
import { Stores } from "../../stores/Stores";
import { MeshConceptExporter } from "../../services/export/MeshConceptExporter";
import { PathConceptExporter } from "../../services/export/PathConceptExporter";
import { ConceptType } from "./models/concepts/Concept";
import * as ReactDOMServer from 'react-dom/server';

export class CanvasExporter {
    private conceptExporters: IConceptExporter[];

    constructor(getStores: () => Stores) {
        this.conceptExporters = [new MeshConceptExporter(getStores), new PathConceptExporter(getStores)];
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