import * as React from 'react';
import { Registry } from '../../../../core/Registry';
import { IViewExporter } from '../../../common/io/IViewExporter';
import { ConceptType } from '../../../../core/models/views/View';
import ReactDOMServer = require('react-dom/server');


export class NodeViewExporter implements IViewExporter {
    viewType: ConceptType.ActionConcept;
    private registry: Registry;

    constructor(registry: Registry) {
        this.registry = registry;
    }

    export() {
        const nodes = this.registry.stores.nodeStore.getNodes()

        const nodeElements = nodes.map(node => <g data-data={JSON.stringify(node.toJson())}></g>);
        const groupElement = nodes.length > 0 ? <g data-view-type={ConceptType.ActionConcept} key={ConceptType.ActionConcept}>{nodeElements}</g> : null;

        return ReactDOMServer.renderToStaticMarkup(groupElement);
    }
}