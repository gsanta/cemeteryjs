import { ConceptType } from "../../../../core/models/views/View";
import { Registry } from "../../../../core/Registry";
import { IViewExporter } from "../../../common/io/IViewExporter";
import React = require("react");
import ReactDOMServer = require("react-dom/server");
import { MeshViewContainerComponent } from '../../components/MeshViewComponent';

export class MeshViewExporter implements IViewExporter {
    viewType = ConceptType.MeshConcept;
    private registry: Registry;

    constructor(registry: Registry) {
        this.registry = registry;
    }

    export(): string {
        return ReactDOMServer.renderToStaticMarkup(<MeshViewContainerComponent registry={this.registry} renderWithSettings={true}/>);
    }
}