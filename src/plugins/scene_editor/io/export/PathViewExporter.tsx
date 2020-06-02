import { ConceptType } from "../../../../core/models/views/View";
import { Registry } from "../../../../core/Registry";
import { IViewExporter } from "../../../common/io/IViewExporter";
import ReactDOMServer = require("react-dom/server");
import React = require("react");

export class PathViewExporter implements IViewExporter {
    viewType = ConceptType.PathConcept;
    private registry: Registry;

    constructor(registry: Registry) {
        this.registry = registry;
    }

    export(): string {
        const nodes = this.registry.stores.canvasStore.getPathConcepts()

        const elements = nodes.map(node => <g data-data={JSON.stringify(node.toJson())}></g>);
        const groupElement = nodes.length > 0 ? <g data-view-type={this.viewType} key={this.viewType}>{elements}</g> : null;

        return ReactDOMServer.renderToStaticMarkup(groupElement);
    }
}