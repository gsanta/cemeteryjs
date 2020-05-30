import { ConceptType, View } from "../../../../core/models/views/View";
import { Registry } from "../../../../core/Registry";
import { PathViewContainerComponent } from '../../components/PathViewComponent';
import { IViewExporter } from "../../../common/io/IViewExporter";
import ReactDOMServer = require("react-dom/server");
import React = require("react");

export class PathViewExporter implements IViewExporter {
    viewType = ConceptType.ModelConcept;
    private registry: Registry;

    constructor(registry: Registry) {
        this.registry = registry;
    }

    export(): string {
        return ReactDOMServer.renderToStaticMarkup(<PathViewContainerComponent registry={this.registry} renderWithSettings={true}/>);
    }
}