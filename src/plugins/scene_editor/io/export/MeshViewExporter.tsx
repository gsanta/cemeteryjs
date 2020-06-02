import { ConceptType } from "../../../../core/models/views/View";
import { Registry } from "../../../../core/Registry";
import { IViewExporter } from "../../../common/io/IViewExporter";
import React = require("react");
import ReactDOMServer = require("react-dom/server");

export class MeshViewExporter implements IViewExporter {
    viewType = ConceptType.MeshConcept;
    private registry: Registry;

    constructor(registry: Registry) {
        this.registry = registry;
    }

    export(): string {
        const nodes = this.registry.stores.canvasStore.getMeshConcepts();

        const nodeElements = nodes.map(node => <g data-data={JSON.stringify(node.toJson())}></g>);
        const groupElement = nodes.length > 0 ? <g data-view-type={this.viewType} key={this.viewType}>{nodeElements}</g> : null;

        return ReactDOMServer.renderToStaticMarkup(groupElement);
    }
}