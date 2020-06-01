import * as React from 'react';
import { ConceptType } from '../../../../core/models/views/View';
import { Registry } from '../../../../core/Registry';
import { IViewExporter } from '../../../common/io/IViewExporter';
import ReactDOMServer = require('react-dom/server');

export class NodeConnectionViewExporter implements IViewExporter {
    viewType: ConceptType.ActionNodeConnectionConcept;
    private registry: Registry;

    constructor(registry: Registry) {
        this.registry = registry;
    }

    export() {
        const connections = this.registry.stores.nodeStore.getConnections()

        const connectionElements = connections.map(node => <g data-data={JSON.stringify(node.toJson())}></g>);
        const groupElement = connections.length > 0 ? <g data-view-type={ConceptType.ActionNodeConnectionConcept} key={ConceptType.ActionNodeConnectionConcept}>{connectionElements}</g> : null;

        return ReactDOMServer.renderToStaticMarkup(groupElement);
    }
}