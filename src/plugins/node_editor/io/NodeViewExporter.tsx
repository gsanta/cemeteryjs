import * as React from 'react';
import { NodeGroupComponent } from "../components/NodeGroupComponent";
import { Registry } from '../../../core/Registry';
import { IViewExporter } from '../../common/io/IViewExporter';
import { ConceptType } from '../../../core/models/views/View';
import ReactDOMServer = require('react-dom/server');


export class NodeViewExporter implements IViewExporter {
    viewType: ConceptType.ActionConcept;
    private registry: Registry;

    constructor(registry: Registry) {
        this.registry = registry;
    }

    export() {
        return ReactDOMServer.renderToStaticMarkup(<NodeGroupComponent registry={this.registry} renderWithSettings={true}/>);
    }
}