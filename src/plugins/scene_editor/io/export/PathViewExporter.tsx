import { ConceptType } from "../../../../core/models/views/View";
import { Registry } from "../../../../core/Registry";
import { IViewExporter, ViewGroupJson } from "../../../common/io/IViewExporter";
import ReactDOMServer = require("react-dom/server");
import React = require("react");

export class PathViewExporter implements IViewExporter {
    viewType = ConceptType.PathConcept;
    private registry: Registry;

    constructor(registry: Registry) {
        this.registry = registry;
    }

    export(): ViewGroupJson {
        const views = this.registry.stores.canvasStore.getMeshConcepts();

        return {
            viewType: this.viewType,
            views: views.map(node => node.toJson())
        }
    }
}