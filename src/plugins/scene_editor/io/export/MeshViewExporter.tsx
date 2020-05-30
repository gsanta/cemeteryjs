import { ConceptType } from "../../../../core/models/views/View";
import { Registry } from "../../../../core/Registry";
import { IViewExporter } from "../../../common/io/IViewExporter";
import React = require("react");
import ReactDOMServer = require("react-dom/server");
import { NodeViewContainerComponent } from "../../../node_editor/components/NodeComponent";

export class MeshViewExporter implements IViewExporter {
    viewType = ConceptType.MeshConcept;
    private registry: Registry;

    constructor(registry: Registry) {
        this.registry = registry;
    }

    export(): string {
        return ReactDOMServer.renderToStaticMarkup(<NodeViewContainerComponent registry={this.registry} renderWithSettings={true}/>);
    }
}